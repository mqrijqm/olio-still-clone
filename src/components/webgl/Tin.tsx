"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import gsap from "gsap";
import { products } from "@/content/site";

/**
 * Pravougaona OLIO limenka napravljena u kodu (bez .glb modela):
 * telo = box sa etiketama (Codex print artwork) na 4 strane, metalne ivice gore/dole,
 * tamni poklopac, zeleni čep i crna ručka. Referenca (drinkstill.nz) koristi can.glb + HDRI;
 * mi koristimo RoomEnvironment (generiše se lokalno, nema 1 MB HDR fajla).
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

function Env() {
  const get = useThree((s) => s.get);
  useEffect(() => {
    // three.js objekti se namerno menjaju direktno — uzimamo ih preko get() unutar efekta
    const { gl, scene } = get();
    const pmrem = new THREE.PMREMGenerator(gl);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = env;
    scene.environmentIntensity = 0.7;
    return () => {
      env.dispose();
      pmrem.dispose();
    };
  }, [get]);
  return null;
}

function useLabelMaterials() {
  const urls = products.flatMap((p) => [p.labels.front, p.labels.side]);
  const tex = useLoader(THREE.TextureLoader, urls);
  const { gl } = useThree();

  return useMemo(() => {
    tex.forEach((t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = Math.min(8, gl.capabilities.getMaxAnisotropy());
    });
    // za svaki proizvod: [front, side] materijali
    return products.map((p, i) => {
      const mk = (map: THREE.Texture) =>
        new THREE.MeshPhysicalMaterial({
          map,
          roughness: 0.42,
          metalness: 0.18,
          clearcoat: 0.2,
          clearcoatRoughness: 0.35,
        });
      return { front: mk(tex[i * 2]), side: mk(tex[i * 2 + 1]), color: p.tinColor };
    });
  }, [tex, gl]);
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

function TinMesh({ index, control }: { index: number; control: React.RefObject<TinControl> }) {
  const group = useRef<THREE.Group>(null);
  const mats = useLabelMaterials();
  const [shown, setShown] = useState(index);
  const prev = useRef(index);
  const mouse = useRef({ x: 0, y: 0 });

  const steel = useMemo(() => new THREE.MeshStandardMaterial({ color: "#c9c9c4", metalness: 1, roughness: 0.28 }), []);
  const lid = useMemo(() => new THREE.MeshStandardMaterial({ color: "#1b1c18", metalness: 0.85, roughness: 0.32 }), []);
  const cap = useMemo(() => new THREE.MeshStandardMaterial({ color: "#2f6b3d", metalness: 0.2, roughness: 0.38 }), []);
  const black = useMemo(() => new THREE.MeshStandardMaterial({ color: "#111210", metalness: 0.1, roughness: 0.45 }), []);
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

  const m = mats[shown];
  const tinTint = useMemo(() => new THREE.MeshStandardMaterial({ color: m.color, metalness: 0.3, roughness: 0.5 }), [m.color]);
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
}: {
  index?: number;
  control: React.RefObject<TinControl>;
  className?: string;
  zoom?: number;
  shadow?: boolean;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  // renderuj samo kad je canvas na ekranu — štedi GPU na slabijim laptopovima
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: "100px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const dpr: [number, number] = typeof navigator !== "undefined" && (navigator.hardwareConcurrency ?? 8) <= 4 ? [1, 1.25] : [1, 1.75];

  return (
    <div ref={wrap} className={className}>
      <Canvas
        frameloop={inView ? "always" : "never"}
        dpr={dpr}
        camera={{ position: [0, 0.35, 4.2 / zoom], fov: 30 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 0.92;
        }}
      >
        <Env />
        <CameraFit zoom={zoom} />
        <directionalLight position={[-3, 4, 3]} intensity={1.6} />
        <directionalLight position={[3, 1, -2]} intensity={0.5} color="#dfe3c8" />
        <TinMesh index={index} control={control} />
        {shadow && <Shadow />}
      </Canvas>
    </div>
  );
}
