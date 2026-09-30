"use client";

import dynamic from "next/dynamic";

// 3D scena se učitava tek u browseru i odvojeno od glavnog JS-a (three.js je težak)
const TinLazy = dynamic(() => import("./Tin"), { ssr: false, loading: () => null });
export default TinLazy;
export type { TinControl } from "./Tin";
