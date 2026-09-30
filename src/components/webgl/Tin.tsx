"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import { products } from "@/content/site";

/**
 * Pravougaona OLIO limenka napravljena u kodu (bez .glb modela):
 * telo = box sa etiketama (Codex print artwork) na 4 strane, metalne ivice gore/dole,
 * tamni poklopac, zeleni čep i crna ručka. Referenca (drinkstill.nz) koristi can.glb + HDRI.
 * Ovde: Phong materijali + 3 svetla — shaderi se kompajliraju višestruko brže od PBR+PMREM,
 * što je na Windows/Direct3D bila glavna kočnica pri učitavanju.
 */

// proporcije prave limenke od 500 ml
const W = 1;
const H = 1.62;
const D = 0.58;

export type TinControl = {
  rotY: number; // spoljna rotacija (scroll)
  spin: number; // dodatni okret pri promeni proizvoda
  float: number; // 0..1 koliko "lebdi"
  tiltX: number;
};

// three.js teksture su namenski mutabilne — podešavanje je izdvojeno iz hooka
function prepTexture(t: THREE.Texture, anisotropy: number) {
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = anisotropy;
}

function useLabelMaterials(variants: number[]) {
  // učitavaju se SAMO etikete varijanti koje ova scena prikazuje (hero/Inside = 1 limenka)
  const urls = variants.flatMap((v) => [products[v].labels.front, products[v].labels.side]);
  const tex = useLoader(THREE.TextureLoader, urls);
  const get = useThree((s) => s.get);
  const key = variants.join(",");

  return useMemo(() => {
    const { gl } = get();
    const out: Record<number, { front: THREE.Material; side: THREE.Material; color: string }> = {};
    variants.forEach((v, i) => {
      const mk = (map: THREE.Texture) => {
        prepTexture(map, Math.min(4, gl.capabilities.getMaxAnisotropy()));
        // Phong: brz shader, blagi odsjaj kao na štampanom limu
        return new THREE.MeshPhongMaterial({ map, shininess: 26, specular: new THREE.Color("#3a3a34") });
      };
      out[v] = { front: mk(tex[i * 2]), side: mk(tex[i * 2 + 1]), color: products[v].tinColor };
    });
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `key` je stabilna verzija `variants`
  }, [tex, get, key]);
}

/**
 * "Zagrevanje": teksture se pošalju na GPU i shaderi se kompajliraju odmah po učitavanju,
 * a ne u trenutku kad scena prvi put uđe u ekran (to je izazivalo trzaje na skrolu).
 */
function Warmup({ onReady }: { onReady: () => void }) {
  const get = useThree((s) => s.get);
  useEffect(() => {
    const { gl, scene, camera } = get();
    scene.traverse((o) => {
      const m = (o as THREE.Mesh).material;
      (Array.isArray(m) ? m : m ? [m] : []).forEach((mat) => {
        const map = (mat as THREE.MeshPhongMaterial).map;
        if (map) gl.initTexture(map);
      });
    });
    // compileAsync koristi paralelno kompajliranje (KHR_parallel_shader_compile) — ne blokira stranicu
    let alive = true;
    gl.compileAsync(scene, camera).then(() => alive && onReady());
    return () => {
      alive = false;
    };
  }, [get, onReady]);
  return null;
}

function handleCurve() {
  // luk ručke (preklopljena ručka kao na fotografiji)
  const pts = [
    new THREE.Vector3(-0.16, 0, 0),
    new THREE.Vector3(-0.17, 0.1, 0),
    new THREE.Vector3(-0.1, 0.19, 0),
    new THREE.Vector3(0.1, 0.19, 0),
    new THREE.Vector3(0.17, 0.1, 0),
    new THREE.Vector3(0.16, 0, 0),
  ];
  return new THREE.CatmullRomCurve3(pts);
}

function TinMesh({ index, control, variants }: { index: number; control: React.RefObject<TinControl>; variants: number[] }) {
  const group = useRef<THREE.Group>(null);
  const mats = useLabelMaterials(variants);
  const [shown, setShown] = useState(index);
  const prev = useRef(index);
  const mouse = useRef({ x: 0, y: 0 });

  const steel = useMemo(() => new THREE.MeshPhongMaterial({ color: "#b9b9b3", specular: new THREE.Color("#ffffff"), shininess: 90 }), []);
  const lid = useMemo(() => new THREE.MeshPhongMaterial({ color: "#1b1c18", specular: new THREE.Color("#8a8a84"), shininess: 60 }), []);
  const cap = useMemo(() => new THREE.MeshPhongMaterial({ color: "#2f6b3d", specular: new THREE.Color("#556655"), shininess: 40 }), []);
  const black = useMemo(() => new THREE.MeshPhongMaterial({ color: "#111210", specular: new THREE.Color("#444444"), shininess: 30 }), []);
  const curve = useMemo(() => handleCurve(), []);

  // promena proizvoda: pun okret, zamena tekstura dok je limenka "bočno"
  useEffect(() => {
    if (index === prev.current) return;
    prev.current = index;
    const c = control.current;
    if (!c) return;
    const obj = { v: c.spin };
    gsap.to(obj, {
      v: c.spin + Math.PI * 2,
      duration: 1.15,
      ease: "power2.inOut",
      onUpdate: () => {
        c.spin = obj.v;
      },
    });
    // zamena tekstura oko trenutka kad je limenka okrenuta bočno (~1/3 tween-a)
    const t = window.setTimeout(() => setShown(index), 380);
    return () => window.clearTimeout(t);
  }, [index, control]);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((state) => {
    const g = group.current;
    const c = control.current;
    if (!g || !c) return;
    const t = state.clock.elapsedTime;
    const targetY = c.rotY + c.spin + mouse.current.x * 0.18 - 0.55;
    g.rotation.y += (targetY - g.rotation.y) * 0.08;
    const targetX = c.tiltX + mouse.current.y * 0.06 + 0.12;
    g.rotation.x += (targetX - g.rotation.x) * 0.08;
    g.position.y = Math.sin(t * 0.9) * 0.035 * c.float;
    g.rotation.z = Math.sin(t * 0.6) * 0.015 * c.float;
  });

  const m = mats[shown] ?? mats[variants[0]];
  const tinTint = useMemo(() => new THREE.MeshPhongMaterial({ color: m.color, shininess: 20 }), [m.color]);
  // BoxGeometry grupe: +x, -x, +y, -y, +z, -z
  const bodyMats = useMemo(() => [m.side, m.side, tinTint, tinTint, m.front, m.side], [m, tinTint]);

  const rimH = 0.045;
  return (
    <group ref={group} dispose={null}>
      {/* telo sa etiketama */}
      <mesh material={bodyMats} castShadow>
        <boxGeometry args={[W, H, D]} />
      </mesh>
      {/* donja i gornja metalna ivica */}
      <mesh material={steel} position={[0, -H / 2 + rimH / 2 - 0.004, 0]}>
        <boxGeometry args={[W + 0.022, rimH, D + 0.022]} />
      </mesh>
      <mesh material={steel} position={[0, H / 2 + rimH / 2 - 0.01, 0]}>
        <boxGeometry args={[W + 0.026, rimH, D + 0.026]} />
      </mesh>
      {/* udubljen tamni poklopac */}
      <mesh material={lid} position={[0, H / 2 + rimH - 0.012, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[W - 0.03, D - 0.03]} />
      </mesh>
      {/* čep */}
      <group position={[W * 0.28, H / 2 + rimH - 0.01, D * 0.12]}>
        <mesh material={steel}>
          <cylinderGeometry args={[0.1, 0.1, 0.03, 40]} />
        </mesh>
        <mesh material={cap} position={[0, 0.035, 0]}>
          <cylinderGeometry args={[0.078, 0.082, 0.05, 40]} />
        </mesh>
      </group>
      {/* ručka */}
      <group position={[-W * 0.06, H / 2 + rimH - 0.01, -D * 0.05]} rotation={[-0.35, 0, 0]}>
        <mesh material={black}>
          <tubeGeometry args={[curve, 48, 0.022, 10, false]} />
        </mesh>
        <mesh material={steel} position={[-0.16, 0, 0]}>
          <cylinderGeometry args={[0.026, 0.03, 0.03, 16]} />
        </mesh>
        <mesh material={steel} position={[0.16, 0, 0]}>
          <cylinderGeometry args={[0.026, 0.03, 0.03, 16]} />
        </mesh>
      </group>
    </group>
  );
}

// Na uskim (portrait) platnima kamera se odmiče da limenka ne bude šira od kadra
function CameraFit({ zoom }: { zoom: number }) {
  const get = useThree((s) => s.get);
  const size = useThree((s) => s.size);
  useEffect(() => {
    const camera = get().camera as THREE.PerspectiveCamera;
    const aspect = size.width / Math.max(1, size.height);
    camera.position.z = (4.2 / zoom) * Math.max(1, 0.62 / aspect);
    camera.updateProjectionMatrix();
  }, [get, size, zoom]);
  return null;
}

function Shadow() {
  // meka senka ispod limenke (radijalni gradijent na ravni) — jeftinije od pravih senki
  const tex = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const ctx = c.getContext("2d")!;
    const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0, "rgba(0,0,0,0.55)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  }, []);
  return (
    <mesh position={[0, -H / 2 - 0.28, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[1.9, 0.9]} />
      <meshBasicMaterial map={tex} transparent depthWrite={false} opacity={0.5} />
    </mesh>
  );
}

export default function TinScene({
  index = 0,
  control,
  className = "",
  zoom = 1,
  shadow = true,
  variants = [0],
  defer = 0,
  afterIntro = false,
  onReady: onReadyProp,
}: {
  index?: number;
  control: React.RefObject<TinControl>;
  className?: string;
  zoom?: number;
  shadow?: boolean;
  /** koje limenke (indeksi u products) scena učitava */
  variants?: number[];
  /** ms pre montiranja (posle intro-a ako je afterIntro) */
  defer?: number;
  /** montiraj tek kad hero intro završi — da ne otima frejmove animaciji */
  afterIntro?: boolean;
  onReady?: () => void;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [mounted, setMounted] = useState(defer === 0 && !afterIntro);
  const [ready, setReady] = useState(false);
  const [warm, setWarm] = useState(true);

  // renderuj samo kad je canvas na ekranu — štedi GPU na slabijim laptopovima
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: "200px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // odloženo montiranje: posle intro-a (+ `defer` ms), u trenutku kad je browser besposlen
  useEffect(() => {
    if (mounted) return;
    let t = 0;
    let idle = 0;
    const start = () => {
      t = window.setTimeout(() => {
        const ric = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 1));
        idle = ric(() => setMounted(true), { timeout: 1500 } as IdleRequestOptions) as unknown as number;
      }, defer);
    };
    const w = window as Window & { __olioIntroDone?: boolean };
    if (!afterIntro || w.__olioIntroDone) start();
    else window.addEventListener("olio:intro-done", start, { once: true });
    return () => {
      window.removeEventListener("olio:intro-done", start);
      window.clearTimeout(t);
      window.cancelIdleCallback?.(idle);
    };
  }, [defer, afterIntro, mounted]);

  // ref da useCallback ostane stabilan (Warmup ga ima u zavisnostima)
  const readyCb = useRef(onReadyProp);
  useEffect(() => {
    readyCb.current = onReadyProp;
  }, [onReadyProp]);

  const onReady = useCallback(() => {
    setReady(true);
    readyCb.current?.();
    // par frejmova i van ekrana da se sve pripremi, pa se renderovanje gasi
    window.setTimeout(() => setWarm(false), 600);
  }, []);

  const dpr: [number, number] = typeof navigator !== "undefined" && (navigator.hardwareConcurrency ?? 8) <= 4 ? [1, 1.25] : [1, 1.5];

  return (
    <div ref={wrap} className={`${className} transition-opacity duration-700 ease-out`} style={{ opacity: ready ? 1 : 0 }}>
      {mounted && (
        <Canvas
          frameloop={inView || warm ? "always" : "never"}
          // meri offsetWidth (bez CSS transformacija) i ne reaguje na skrol — inače se platno
          // realocira na svakom frejmu dok roditelj ima scale animaciju (glavni uzrok trzanja)
          resize={{ scroll: false, offsetSize: true, debounce: { scroll: 0, resize: 150 } }}
          dpr={dpr}
          camera={{ position: [0, 0.35, 4.2 / zoom], fov: 30 }}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          onCreated={({ gl }) => {
            gl.toneMapping = THREE.ACESFilmicToneMapping;
            gl.toneMappingExposure = 0.92;
          }}
        >
          <CameraFit zoom={zoom} />
          <hemisphereLight args={["#fbfaf4", "#6f7158", 1.35]} />
          <directionalLight position={[-3, 4, 3]} intensity={1.9} />
          <directionalLight position={[3, 1, -2]} intensity={0.7} color="#dfe3c8" />
          <Suspense fallback={null}>
            <TinMesh index={index} control={control} variants={variants} />
            {shadow && <Shadow />}
            <Warmup onReady={onReady} />
          </Suspense>
        </Canvas>
      )}
    </div>
  );
}
