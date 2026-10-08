"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useLayoutEffect, useRef, useSyncExternalStore } from "react";
import * as THREE from "three";
import { FH, GREENHOUSE, LAB, LAYOUTS, LIFT_X, NFLOORS, SLAB, TOWER, type FarmType, type P3 } from "./layouts";
import { CONVEYOR_Y, CROPS, DOCK, HOME, PACKER, SEEDER, SPECTRA, VAN_Z, dayFactor, lightsOn, type FarmSim } from "./sim";

/** Receives screen positions of 3D anchors so the HUD can pin DOM labels to them. */
export type AnchorSink = { set: (key: string, x: number, y: number, visible: boolean) => void; flush: () => void };

type Props = {
  sim: FarmSim;
  reduce: boolean;
  compact: boolean;
  /** Landing-page hero: fixed wide framing, no clicks, no labels. */
  hero?: boolean;
  /** Right-to-left page: the side panel is on the left, so frame the farm further right. */
  rtl?: boolean;
  anchors?: AnchorSink;
  /** Called once, after the first frame has been drawn. */
  onReady?: () => void;
};
type SimProp = { sim: FarmSim };

/* ------------------------------ Palette ------------------------------ */

const C = {
  white: "#ffffff",
  shell: "#f6f8fb",
  wall: "#e9edf3",
  soil: "#4a3a2d",
  ink: "#2a3348",
  steel: "#c3cad6",
  wood: "#cfa56b",
  glass: "#cfe0f2",
  green: "#2e9e5b",
  solar: "#2d4fa0",
};
const SKY_DAY = new THREE.Color("#e8eef4");
const SKY_NIGHT = new THREE.Color("#0b1222");
const GROUND_DAY = new THREE.Color("#eef2ee");
const GROUND_NIGHT = new THREE.Color("#18202f");
const ROAD_DAY = new THREE.Color("#d6dce5");
const ROAD_NIGHT = new THREE.Color("#222b3c");
const SPROUT = new THREE.Color("#c8eba8");

// Scratch objects reused every frame.
const _o = new THREE.Object3D();
const _c = new THREE.Color();
const _c2 = new THREE.Color();
const _v = new THREE.Vector3();

const range = (n: number) => Array.from({ length: n }, (_, i) => i);

/* ------------------------------- Canvas ------------------------------- */

export default function FarmCanvas(props: Props) {
  const { sim } = props;
  const type = useSyncExternalStore(sim.subscribe, () => sim.layout.type, () => sim.layout.type);
  return (
    <Canvas
      shadows="percentage"
      // Measure layout size, not the transformed size, so scroll-linked scaling never shrinks the canvas.
      resize={{ offsetSize: true, scroll: false }}
      dpr={[1, 2]}
      camera={{ fov: 26, near: 0.5, far: 240, position: [32, 24, 38] }}
      gl={{ antialias: true }}
      onPointerMissed={() => {
        document.body.style.cursor = "";
      }}
    >
      {props.hero && <PauseOffscreen />}
      {props.onReady && <FirstFrame onReady={props.onReady} />}
      <Ticker sim={props.sim} />
      <Sky sim={props.sim} />
      <CameraRig {...props} type={type} />
      <Ground sim={sim} />
      <Shell sim={sim} type={type} />
      {range(NFLOORS).map((k) => (
        <Unit key={`${type}${k}`} k={k} sim={sim} type={type} interactive={!props.hero} />
      ))}
      <Tanks />
      {type !== "tower" && <SolarField />}
      {type === "tower" ? <Lift sim={sim} /> : <Cart sim={sim} type={type} />}
      <Hall sim={sim} />
      <Drone sim={sim} />
      <Van sim={sim} />
      <Grounds type={type} />
      {props.anchors && <Projector sim={sim} anchors={props.anchors} type={type} />}
    </Canvas>
  );
}

/**
 * The landing page's farms are decoration: stop drawing them while they're scrolled out of
 * view, to save battery and keep scrolling smooth. (The demo keeps running: its HUD needs it.)
 */
function PauseOffscreen() {
  const gl = useThree((s) => s.gl);
  const setFrameloop = useThree((s) => s.setFrameloop);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setFrameloop(e.isIntersecting ? "always" : "never"), { rootMargin: "120px" });
    io.observe(gl.domElement);
    return () => io.disconnect();
  }, [gl, setFrameloop]);
  return null;
}

function FirstFrame({ onReady }: { onReady: () => void }) {
  const done = useRef(false);
  useFrame(() => {
    if (done.current) return;
    done.current = true;
    // Wait one more frame so the drawn image is actually on screen.
    requestAnimationFrame(onReady);
  });
  return null;
}

function Ticker({ sim }: SimProp) {
  useFrame((_, dt) => sim.step(dt));
  return null;
}

/* ------------------------------ Lighting ------------------------------ */

function Sky({ sim }: SimProp) {
  const bg = useRef<THREE.Color>(null);
  const fog = useRef<THREE.Fog>(null);
  const sun = useRef<THREE.DirectionalLight>(null);
  const hemi = useRef<THREE.HemisphereLight>(null);
  const moon = useRef<THREE.DirectionalLight>(null);

  useLayoutEffect(() => {
    sun.current?.target.position.set(3, 0, 1);
    sun.current?.target.updateMatrixWorld();
  }, []);

  useFrame(() => {
    const day = dayFactor(sim.hour);
    bg.current?.lerpColors(SKY_NIGHT, SKY_DAY, day);
    if (fog.current && bg.current) fog.current.color.copy(bg.current);
    const a = ((sim.hour - 6) / 12) * Math.PI;
    if (sun.current) {
      sun.current.position.set(Math.cos(a) * 34 + 3, Math.max(6, Math.sin(a) * 34), 22);
      sun.current.intensity = 0.15 + day * 2.6;
    }
    if (hemi.current) {
      hemi.current.intensity = 0.35 + day * 0.85;
      hemi.current.color.set(day > 0.4 ? "#eef4ff" : "#5b6fa8");
    }
    if (moon.current) moon.current.intensity = (1 - day) * 0.35;
  });

  return (
    <>
      <color ref={bg} attach="background" args={["#e8eef4"]} />
      <fog ref={fog} attach="fog" args={["#e8eef4", 70, 150]} />
      <hemisphereLight ref={hemi} args={["#eef4ff", "#c9d3c2", 1]} />
      <directionalLight
        ref={sun}
        castShadow
        position={[20, 30, 22]}
        intensity={2.4}
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0004}
        shadow-camera-left={-26}
        shadow-camera-right={26}
        shadow-camera-top={26}
        shadow-camera-bottom={-26}
        shadow-camera-near={1}
        shadow-camera-far={110}
      />
      <directionalLight ref={moon} position={[-20, 25, 10]} color="#8aa2ff" intensity={0} />
    </>
  );
}

/* ------------------------------- Camera ------------------------------- */

function CameraRig({ sim, reduce, compact, hero, rtl, type }: Props & { type: FarmType }) {
  const { camera } = useThree();
  const target = useRef(new THREE.Vector3(3.5, 3.4, 1.4));
  const want = useRef(new THREE.Vector3());
  const wantT = useRef(new THREE.Vector3());
  const first = useRef(true);

  useFrame((state, dt) => {
    const f = sim.focus;
    const L = LAYOUTS[type];
    const zoom = compact ? 1.45 : 1.22;
    const pick = (fr: { ltr: P3; rtl: P3; compact: P3 }) => (compact ? fr.compact : rtl ? fr.rtl : fr.ltr);
    if (hero && f === null) {
      wantT.current.set(3.4, 3.2, 1.6);
      want.current.set(25, 17, 30).multiplyScalar(compact ? 1.25 : 1.05).add(wantT.current);
      if (!reduce) want.current.add(_v.set(state.pointer.x * 2, state.pointer.y * 1, -state.pointer.x * 1.2));
    } else if (f === null) {
      wantT.current.set(...pick(L.over));
      want.current.set(...L.over.p).multiplyScalar(zoom).add(wantT.current);
      if (!compact && !reduce) want.current.add(_v.set(state.pointer.x * 2.2, state.pointer.y * 1.2, -state.pointer.x * 1.4));
    } else {
      const [ux, uy, uz] = L.units[f];
      wantT.current.set(...pick(L.focus)).add(_v.set(ux, uy, uz));
      want.current.set(...(compact ? L.focus.pCompact : L.focus.p)).add(_v.set(ux, uy, uz));
      if (!compact && !reduce) want.current.add(_v.set(state.pointer.x * 0.8, state.pointer.y * 0.4, 0));
    }
    const k = reduce || first.current ? 1 : 1 - Math.exp(-dt * 2.4);
    first.current = false;
    camera.position.lerp(want.current, k);
    target.current.lerp(wantT.current, k);
    camera.lookAt(target.current);
  });
  return null;
}

/* ------------------------------- Ground ------------------------------- */

function Ground({ sim }: SimProp) {
  const ground = useRef<THREE.MeshStandardMaterial>(null);
  const road = useRef<THREE.MeshStandardMaterial>(null);
  const lamps = useRef<THREE.MeshStandardMaterial>(null);
  useFrame(() => {
    const day = dayFactor(sim.hour);
    ground.current?.color.lerpColors(GROUND_NIGHT, GROUND_DAY, day);
    road.current?.color.lerpColors(ROAD_NIGHT, ROAD_DAY, day);
    if (lamps.current) lamps.current.emissiveIntensity = day < 0.35 ? 2.2 : 0;
  });
  return (
    <group>
      <mesh rotation-x={-Math.PI / 2} position-y={-0.01} receiveShadow>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial ref={ground} color={GROUND_DAY} roughness={1} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.005, VAN_Z + 0.2]} receiveShadow>
        <planeGeometry args={[200, 2.8]} />
        <meshStandardMaterial ref={road} color={ROAD_DAY} roughness={0.95} />
      </mesh>
      {range(30).map((i) => (
        <mesh key={i} rotation-x={-Math.PI / 2} position={[-58 + i * 4, 0.012, VAN_Z + 0.2]}>
          <planeGeometry args={[1.6, 0.1]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      ))}
      {[-15, -5, 5, 15].map((x) => (
        <group key={x} position={[x + 2, 0, VAN_Z - 1.6]}>
          <mesh position-y={1.4} castShadow>
            <cylinderGeometry args={[0.05, 0.07, 2.8, 8]} />
            <meshStandardMaterial color={C.steel} />
          </mesh>
          <mesh position={[0, 2.8, 0.25]}>
            <boxGeometry args={[0.18, 0.08, 0.6]} />
            <meshStandardMaterial ref={x === -15 ? lamps : undefined} color="#fff6dc" emissive="#ffd27a" emissiveIntensity={0} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/* ------------------------------- Buildings ------------------------------ */

/** The building around the four growing units: different for every farm type. */
function Shell({ sim, type }: SimProp & { type: FarmType }) {
  if (type === "container") return <ContainerShell />;
  if (type === "greenhouse") return <GreenhouseShell />;
  if (type === "lab") return <LabShell />;
  return <TowerShell sim={sim} />;
}

function TowerShell({ sim }: SimProp) {
  const top = NFLOORS * FH;
  const fanA = useRef<THREE.Group>(null);
  const fanB = useRef<THREE.Group>(null);
  const glow = useRef<THREE.MeshStandardMaterial>(null);
  useFrame((_, dt) => {
    const lit = sim.floors.filter((f) => lightsOn(sim.hour, f.hours)).length;
    const s = sim.playing ? (2 + lit * 2.5) * dt : 0;
    if (fanA.current) fanA.current.rotation.y += s;
    if (fanB.current) fanB.current.rotation.y += s * 0.9;
    if (glow.current) glow.current.emissiveIntensity = (1 - dayFactor(sim.hour)) * lit * 0.12;
  });
  return (
    <group>
      {range(NFLOORS).map((k) => {
        const y0 = k * FH;
        return (
          <group key={k}>
            <mesh position={[0, y0 + SLAB / 2, 0]} castShadow receiveShadow>
              <boxGeometry args={[11, SLAB, 4]} />
              <meshStandardMaterial color={C.shell} />
            </mesh>
            <mesh position={[0, y0 + FH / 2, TOWER.z0 - 0.06]} receiveShadow>
              <boxGeometry args={[11, FH, 0.12]} />
              <meshStandardMaterial color={k % 2 ? "#f1f4f8" : "#ebeff5"} />
            </mesh>
            <mesh position={[TOWER.x0 - 0.06, y0 + FH / 2, 0]} receiveShadow>
              <boxGeometry args={[0.12, FH, 4]} />
              <meshStandardMaterial color="#e2e7ef" />
            </mesh>
          </group>
        );
      })}
      {/* Roof with solar panels and climate fans */}
      <mesh position={[0, top + 0.15, 0]} castShadow receiveShadow>
        <boxGeometry args={[11.5, 0.3, 4.5]} />
        <meshStandardMaterial color={C.white} />
      </mesh>
      {range(4).map((i) => (
        <mesh key={i} position={[-4.1 + i * 2.25, top + 0.62, -0.6]} rotation-x={-0.38} castShadow>
          <boxGeometry args={[2, 0.08, 1.9]} />
          <meshStandardMaterial color={C.solar} roughness={0.3} metalness={0.2} />
        </mesh>
      ))}
      {[
        [3.6, fanA],
        [1.6, fanB],
      ].map(([x, ref], i) => (
        <group key={i} position={[x as number, top + 0.3, 1.35]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.55, 0.55, 0.45, 20]} />
            <meshStandardMaterial color={C.wall} />
          </mesh>
          <group ref={ref as React.RefObject<THREE.Group>} position-y={0.24}>
            {range(3).map((b) => (
              <mesh key={b} rotation-y={(b * Math.PI * 2) / 3}>
                <boxGeometry args={[0.85, 0.03, 0.14]} />
                <meshStandardMaterial color={C.ink} />
              </mesh>
            ))}
          </group>
        </group>
      ))}
      {/* Glass side wall and front columns */}
      <mesh position={[TOWER.x1 + 0.04, top / 2, 0]}>
        <boxGeometry args={[0.06, top, 4]} />
        <meshStandardMaterial ref={glow} color={C.glass} transparent opacity={0.3} roughness={0.1} emissive="#ff4fd8" emissiveIntensity={0} />
      </mesh>
      {[TOWER.x0, TOWER.x1].map((x) => (
        <mesh key={x} position={[x, top / 2, TOWER.z1]} castShadow>
          <boxGeometry args={[0.28, top, 0.28]} />
          <meshStandardMaterial color={C.white} />
        </mesh>
      ))}
    </group>
  );
}

/**
 * Shipping containers drawn as a cutaway: the long walls are cut at sill height and the roof
 * is left off, so the racks inside stay visible from the usual camera angle.
 */
function ContainerShell() {
  const L = LAYOUTS.container;
  const { w, d, h } = L.size;
  return (
    <group>
      {L.units.map(([x, y, z], k) => (
        <group key={k} position={[x, y, z]}>
          <mesh position-y={0.06} receiveShadow castShadow>
            <boxGeometry args={[w, 0.12, d]} />
            <meshStandardMaterial color="#d9dee7" />
          </mesh>
          {/* Cut long walls, in the brand green */}
          {[-d / 2, d / 2].map((zz) => (
            <mesh key={zz} position={[0, 0.25, zz]} castShadow receiveShadow>
              <boxGeometry args={[w, 0.5, 0.07]} />
              <meshStandardMaterial color={C.green} roughness={0.6} />
            </mesh>
          ))}
          {/* Closed far end with ribs and the climate unit; open loading end with its frame */}
          <mesh position={[-w / 2, h / 2, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.08, h, d]} />
            <meshStandardMaterial color={C.white} />
          </mesh>
          {range(7).map((i) => (
            <mesh key={i} position={[-w / 2 - 0.05, h / 2, -d / 2 + 0.25 + i * ((d - 0.5) / 6)]}>
              <boxGeometry args={[0.03, h - 0.2, 0.06]} />
              <meshStandardMaterial color="#dfe4ec" />
            </mesh>
          ))}
          <mesh position={[-w / 2 - 0.35, 1.7, 0]} castShadow>
            <boxGeometry args={[0.55, 0.8, 1.3]} />
            <meshStandardMaterial color={C.wall} />
          </mesh>
          <mesh position={[-w / 2 - 0.63, 1.7, 0]} rotation-z={Math.PI / 2}>
            <cylinderGeometry args={[0.28, 0.28, 0.02, 20]} />
            <meshStandardMaterial color={C.ink} />
          </mesh>
          {[-1, 1].flatMap((sx) =>
            [-1, 1].map((sz) => (
              <mesh key={`${sx}${sz}`} position={[(sx * w) / 2, h / 2, (sz * d) / 2]} castShadow>
                <boxGeometry args={[0.12, h, 0.12]} />
                <meshStandardMaterial color={C.white} />
              </mesh>
            )),
          )}
          {[-d / 2, d / 2].map((zz) => (
            <mesh key={`r${zz}`} position={[0, h, zz]} castShadow>
              <boxGeometry args={[w, 0.1, 0.1]} />
              <meshStandardMaterial color={C.white} />
            </mesh>
          ))}
          <mesh position={[w / 2, h, 0]}>
            <boxGeometry args={[0.1, 0.1, d]} />
            <meshStandardMaterial color={C.white} />
          </mesh>
          {/* Rack uprights */}
          {[-0.55, 0.55].flatMap((rz) =>
            [-5.1, -2.55, 0, 2.55, 5.1].flatMap((rx) =>
              [-0.3, 0.3].map((dz) => (
                <mesh key={`${rz}${rx}${dz}`} position={[rx, 1.2, rz + dz]}>
                  <boxGeometry args={[0.04, 2.2, 0.04]} />
                  <meshStandardMaterial color={C.steel} />
                </mesh>
              )),
            ),
          )}
        </group>
      ))}
    </group>
  );
}

/** A Venlo-style glass house: one glass ridge over each bay, gutters between them. */
function GreenhouseShell() {
  const G = GREENHOUSE;
  const L = LAYOUTS.greenhouse;
  const w = G.x1 - G.x0;
  const depth = G.z1 - G.z0;
  const cx = (G.x0 + G.x1) / 2;
  const cz = (G.z0 + G.z1) / 2;
  const half = 1.55;
  const rise = G.ridge - G.eave;
  const pane = Math.hypot(half, rise);
  const tilt = Math.atan2(rise, half);
  const posts = range(7).map((i) => G.x0 + (i * w) / 6);
  return (
    <group>
      <mesh position={[cx, 0.03, cz]} receiveShadow>
        <boxGeometry args={[w + 0.3, 0.06, depth + 0.3]} />
        <meshStandardMaterial color="#e3e8ef" />
      </mesh>
      {/* Bench legs under the gutters */}
      {L.units.map(([, , z], k) =>
        [-4.6, -1.5, 1.5, 4.6].flatMap((x) =>
          [-0.68, 0.68].map((dz) => (
            <mesh key={`${k}${x}${dz}`} position={[x, 0.45, z + dz]}>
              <boxGeometry args={[0.05, 0.9, 0.05]} />
              <meshStandardMaterial color={C.steel} />
            </mesh>
          )),
        ),
      )}
      {/* Frame: posts on the long sides, end posts, eave beams */}
      {posts.flatMap((x) =>
        [G.z0, G.z1].map((z) => (
          <mesh key={`${x}${z}`} position={[x, G.eave / 2, z]} castShadow>
            <boxGeometry args={[0.09, G.eave, 0.09]} />
            <meshStandardMaterial color={C.white} />
          </mesh>
        )),
      )}
      {L.units.flatMap(([, , z], k) =>
        [G.x0, G.x1].map((x) => (
          <mesh key={`e${k}${x}`} position={[x, G.eave / 2, z - half]} castShadow>
            <boxGeometry args={[0.09, G.eave, 0.09]} />
            <meshStandardMaterial color={C.white} />
          </mesh>
        )),
      )}
      {/* Gutters and ridges run the length of the house */}
      {[...L.units.map(([, , z]) => z - half), G.z1].map((z) => (
        <mesh key={`g${z}`} position={[cx, G.eave, z]} castShadow>
          <boxGeometry args={[w, 0.1, 0.16]} />
          <meshStandardMaterial color={C.white} />
        </mesh>
      ))}
      {L.units.map(([, , z]) => (
        <mesh key={`r${z}`} position={[cx, G.ridge, z]}>
          <boxGeometry args={[w, 0.06, 0.06]} />
          <meshStandardMaterial color={C.white} />
        </mesh>
      ))}
      {/* Roof glass: two panes per bay */}
      {L.units.flatMap(([, , z]) =>
        [-1, 1].map((s) => (
          <mesh key={`p${z}${s}`} position={[cx, G.eave + rise / 2, z + (s * half) / 2]} rotation-x={s * tilt}>
            <boxGeometry args={[w, 0.02, pane]} />
            <meshStandardMaterial color={C.glass} transparent opacity={0.24} roughness={0.05} depthWrite={false} side={THREE.DoubleSide} />
          </mesh>
        )),
      )}
      {/* Glass walls; the end gables are filled with glass too */}
      {[G.z0, G.z1].map((z) => (
        <mesh key={`w${z}`} position={[cx, G.eave / 2, z]}>
          <boxGeometry args={[w, G.eave, 0.02]} />
          <meshStandardMaterial color={C.glass} transparent opacity={0.18} roughness={0.05} depthWrite={false} />
        </mesh>
      ))}
      {[G.x0, G.x1].map((x) => (
        <mesh key={`s${x}`} position={[x, G.eave / 2, cz]}>
          <boxGeometry args={[0.02, G.eave, depth]} />
          <meshStandardMaterial color={C.glass} transparent opacity={0.18} roughness={0.05} depthWrite={false} />
        </mesh>
      ))}
      {/* Exhaust fans in the far end wall */}
      {[-6.2, -3.1].map((z) => (
        <group key={`f${z}`} position={[G.x0 - 0.05, 1.3, z]}>
          <mesh rotation-z={Math.PI / 2}>
            <cylinderGeometry args={[0.55, 0.55, 0.14, 24]} />
            <meshStandardMaterial color={C.wall} />
          </mesh>
          <mesh position-x={-0.08} rotation-z={Math.PI / 2}>
            <cylinderGeometry args={[0.42, 0.42, 0.02, 24]} />
            <meshStandardMaterial color={C.ink} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/** A research lab, drawn open like the tower: four reach-in growth chambers and a bench. */
function LabShell() {
  const B = LAB;
  const L = LAYOUTS.lab;
  const { w, d, h } = L.size;
  return (
    <group>
      <mesh position={[0, 0.06, 0]} castShadow receiveShadow>
        <boxGeometry args={[B.x1 - B.x0, 0.12, B.z1 - B.z0]} />
        <meshStandardMaterial color={C.shell} />
      </mesh>
      <mesh position={[0, B.h / 2, B.z0 - 0.06]} receiveShadow>
        <boxGeometry args={[B.x1 - B.x0, B.h, 0.12]} />
        <meshStandardMaterial color="#ebeff5" />
      </mesh>
      <mesh position={[B.x0 - 0.06, B.h / 2, 0]} receiveShadow>
        <boxGeometry args={[0.12, B.h, B.z1 - B.z0]} />
        <meshStandardMaterial color="#e2e7ef" />
      </mesh>
      {[B.x0, B.x1].map((x) => (
        <mesh key={x} position={[x, B.h / 2, B.z1]} castShadow>
          <boxGeometry args={[0.22, B.h, 0.22]} />
          <meshStandardMaterial color={C.white} />
        </mesh>
      ))}
      {/* Growth chambers: cabinet, glass door, status screen */}
      {L.units.map(([x, y, z], k) => (
        <group key={k} position={[x, y, z]}>
          <mesh position={[0, h / 2, -d / 2]} castShadow receiveShadow>
            <boxGeometry args={[w, h, 0.06]} />
            <meshStandardMaterial color={C.white} />
          </mesh>
          {[-w / 2, w / 2].map((sx) => (
            <mesh key={sx} position={[sx, h / 2, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.08, h, d]} />
              <meshStandardMaterial color={C.white} />
            </mesh>
          ))}
          <mesh position={[0, h + 0.15, 0]} castShadow>
            <boxGeometry args={[w + 0.08, 0.3, d]} />
            <meshStandardMaterial color={C.white} />
          </mesh>
          <mesh position={[0.6, h + 0.15, d / 2 + 0.005]}>
            <boxGeometry args={[0.5, 0.16, 0.01]} />
            <meshStandardMaterial color="#e9fbef" emissive="#7ee0a0" emissiveIntensity={0.5} />
          </mesh>
          <mesh position={[0, 0.1, 0]} receiveShadow>
            <boxGeometry args={[w, 0.2, d]} />
            <meshStandardMaterial color="#d9dee7" />
          </mesh>
          <mesh position={[0, h / 2 + 0.1, d / 2]}>
            <boxGeometry args={[w - 0.1, h - 0.2, 0.02]} />
            <meshStandardMaterial color={C.glass} transparent opacity={0.16} roughness={0.05} depthWrite={false} />
          </mesh>
        </group>
      ))}
      {/* Lab bench with a monitor and sample jars */}
      <mesh position={[-1.4, 0.9, 1.25]} castShadow receiveShadow>
        <boxGeometry args={[5.4, 0.08, 0.8]} />
        <meshStandardMaterial color={C.white} />
      </mesh>
      {[-3.95, 1.15].flatMap((x) =>
        [0.95, 1.55].map((z) => (
          <mesh key={`${x}${z}`} position={[x, 0.48, z]}>
            <boxGeometry args={[0.06, 0.84, 0.06]} />
            <meshStandardMaterial color={C.steel} />
          </mesh>
        )),
      )}
      <mesh position={[-3.2, 1.25, 1.1]} castShadow>
        <boxGeometry args={[0.9, 0.55, 0.05]} />
        <meshStandardMaterial color={C.ink} emissive="#2e9e5b" emissiveIntensity={0.15} />
      </mesh>
      {range(5).map((i) => (
        <mesh key={i} position={[-1.6 + i * 0.32, 1.04, 1.35]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.2, 12]} />
          <meshStandardMaterial color={i % 2 ? "#cdeccd" : C.glass} transparent opacity={0.8} />
        </mesh>
      ))}
    </group>
  );
}

/** Nutrient tanks feeding the water loop, beside every farm. */
function Tanks() {
  return (
    <group>
      {[-2.2, 0.2].map((z) => (
        <mesh key={z} position={[-8.4, 1.3, z]} castShadow receiveShadow>
          <cylinderGeometry args={[0.85, 0.85, 2.6, 28]} />
          <meshStandardMaterial color="#e3ecf7" />
        </mesh>
      ))}
      <mesh position={[-6.9, 1.9, -1]} rotation-z={Math.PI / 2}>
        <cylinderGeometry args={[0.08, 0.08, 2.8, 10]} />
        <meshStandardMaterial color={C.steel} />
      </mesh>
    </group>
  );
}

/** Ground-mounted solar for the farms without a flat roof to put it on. */
const SOLAR_FIELD: [number, number, number, number] = [-17.5, -11, -10.5, -5];
function SolarField() {
  return (
    <group>
      {range(2).flatMap((r) =>
        range(3).map((i) => (
          <group key={`${r}${i}`} position={[-16 + i * 2.3, 0, -9.6 + r * 2.6]}>
            <mesh position-y={0.55}>
              <boxGeometry args={[0.08, 1.1, 0.08]} />
              <meshStandardMaterial color={C.steel} />
            </mesh>
            <mesh position-y={1.15} rotation-x={-0.45} castShadow>
              <boxGeometry args={[2.1, 0.07, 1.7]} />
              <meshStandardMaterial color={C.solar} roughness={0.3} metalness={0.2} />
            </mesh>
          </group>
        )),
      )}
    </group>
  );
}

/* ----------------------------- Growing units ---------------------------- */

/** One growing unit (a floor, container, bay or chamber): beds, LEDs, plants, click target. */
function Unit({ k, sim, type, interactive }: SimProp & { k: number; type: FarmType; interactive: boolean }) {
  const L = LAYOUTS[type];
  const [ux, uy, uz] = L.units[k];
  const { w, d, h } = L.size;
  const crop = CROPS[k];
  const leds = useRef<(THREE.MeshStandardMaterial | null)[]>([]);
  const light = useRef<THREE.PointLight>(null);
  const plants = useRef<THREE.InstancedMesh>(null);
  const berries = useRef<THREE.InstancedMesh>(null);
  const hover = useRef<THREE.Mesh>(null);
  const hovered = useRef(false);
  const count = L.cols.length * L.rows.length;
  const berry = "berry" in crop && crop.berry;
  const ps = L.plantScale;

  useFrame(() => {
    const f = sim.floors[k];
    const sp = SPECTRA[f.spectrum];
    const on = lightsOn(sim.hour, f.hours);
    // Outline on hover, and on the unit the camera is zoomed into.
    if (hover.current) hover.current.visible = hovered.current || sim.focus === k;
    for (const m of leds.current) {
      if (!m) continue;
      m.emissive.set(sp.color);
      m.emissiveIntensity = on ? 2.6 : 0.04;
    }
    if (light.current) {
      light.current.color.set(sp.color);
      light.current.intensity = on ? 14 : 0;
    }
    const pm = plants.current;
    const bm = berries.current;
    if (!pm) return;
    _c.set(crop.color);
    let i = 0;
    for (const row of L.rows) {
      for (const x of L.cols) {
        let g = f.g;
        if (f.state === "empty" || f.state === "seeding") g = 0;
        if (f.state === "harvesting" && ux + x > sim.drone.sweepX) g = 0;
        const s = g <= 0 ? 0.0001 : (0.22 + g * 0.95) * ps;
        const j = Math.sin(i * 12.9898) * 0.06 * ps;
        _o.position.set(ux + x + j, uy + row.y + s * 0.16, uz + row.z + j * 0.5);
        _o.rotation.set(0, i * 1.7, 0);
        _o.scale.set(s, s * 0.82, s);
        _o.updateMatrix();
        pm.setMatrixAt(i, _o.matrix);
        pm.setColorAt(i, _c2.copy(_c).lerp(SPROUT, Math.max(0, 1 - g * 1.25) + (j > 0 ? 0.06 : 0)));
        if (bm) {
          const bs = berry && g > 0.75 ? (0.09 + (g - 0.75) * 0.25) * ps : 0.0001;
          _o.position.set(ux + x + j + 0.12 * ps, uy + row.y + 0.14 * ps + s * 0.12, uz + row.z + 0.16 * ps);
          _o.scale.setScalar(bs);
          _o.updateMatrix();
          bm.setMatrixAt(i, _o.matrix);
        }
        i++;
      }
    }
    pm.instanceMatrix.needsUpdate = true;
    if (pm.instanceColor) pm.instanceColor.needsUpdate = true;
    if (bm) bm.instanceMatrix.needsUpdate = true;
  });

  return (
    <group>
      <group position={[ux, uy, uz]}>
        {L.beds.map((b, i) => (
          <group key={i}>
            <mesh position={[0, b.top - b.h / 2, b.z]} castShadow receiveShadow>
              <boxGeometry args={[L.ledLen + 0.2, b.h, b.w]} />
              <meshStandardMaterial color={L.bedColor} roughness={type === "tower" ? 1 : 0.6} />
            </mesh>
            {b.w >= 0.5 && (
              <mesh position={[0, b.top + 0.005, b.z]}>
                <boxGeometry args={[L.ledLen, 0.01, 0.1]} />
                <meshStandardMaterial color="#3b82a6" emissive="#3b82a6" emissiveIntensity={0.25} />
              </mesh>
            )}
          </group>
        ))}
        {L.leds.map((l, i) => (
          <mesh key={i} position={[0, l.y, l.z]}>
            <boxGeometry args={[L.ledLen, 0.06, 0.14]} />
            <meshStandardMaterial
              ref={(m) => {
                leds.current[i] = m;
              }}
              color="#ffffff"
              emissive="#ff4fd8"
              emissiveIntensity={2}
            />
          </mesh>
        ))}
        <pointLight ref={light} position={[0, h - 0.5, 0.6]} distance={w < 4 ? 3.5 : 9} decay={1.6} intensity={12} color="#ff4fd8" />
        {/* Hover outline + click target */}
        <mesh ref={hover} position={[0, h / 2, 0]} visible={false}>
          <boxGeometry args={[w + 0.1, h - 0.04, d + 0.1]} />
          <meshBasicMaterial color="#2e9e5b" transparent opacity={0.08} depthWrite={false} />
        </mesh>
        {interactive && (
          <mesh
            position={[0, h / 2, 0]}
            onClick={(e) => {
              e.stopPropagation();
              sim.setFocus(k);
            }}
            onPointerOver={(e) => {
              e.stopPropagation();
              hovered.current = true;
              document.body.style.cursor = "pointer";
            }}
            onPointerOut={() => {
              hovered.current = false;
              document.body.style.cursor = "";
            }}
          >
            <boxGeometry args={[w, h, d]} />
            <meshBasicMaterial transparent opacity={0} depthWrite={false} />
          </mesh>
        )}
      </group>
      <instancedMesh ref={plants} args={[undefined, undefined, count]}>
        <icosahedronGeometry args={[0.27, 0]} />
        <meshStandardMaterial flatShading roughness={0.75} />
      </instancedMesh>
      {berry && (
        <instancedMesh ref={berries} args={[undefined, undefined, count]}>
          <sphereGeometry args={[1, 8, 6]} />
          <meshStandardMaterial color="#e5484d" roughness={0.5} />
        </instancedMesh>
      )}
    </group>
  );
}

/* ------------------------------ Lift & cart ----------------------------- */

function Crate({ seed = false }: { seed?: boolean }) {
  return seed ? (
    <group>
      <mesh castShadow>
        <boxGeometry args={[0.95, 0.1, 1.0]} />
        <meshStandardMaterial color="#3d2f24" />
      </mesh>
      {range(12).map((i) => (
        <mesh key={i} position={[-0.36 + (i % 4) * 0.24, 0.08, -0.3 + Math.floor(i / 4) * 0.3]}>
          <sphereGeometry args={[0.05, 6, 4]} />
          <meshStandardMaterial color="#b9e39a" />
        </mesh>
      ))}
    </group>
  ) : (
    <group>
      <mesh castShadow position-y={0.2}>
        <boxGeometry args={[0.8, 0.4, 0.6]} />
        <meshStandardMaterial color={C.wood} roughness={0.9} />
      </mesh>
      <mesh position-y={0.42}>
        <icosahedronGeometry args={[0.24, 0]} />
        <meshStandardMaterial color="#6cbf6a" flatShading />
      </mesh>
    </group>
  );
}

/** The crate and seed-tray load riding on the lift or cart. */
function Cargo({ sim, y }: SimProp & { y: number }) {
  const crate = useRef<THREE.Group>(null);
  const seed = useRef<THREE.Group>(null);
  useFrame(() => {
    if (crate.current) crate.current.visible = sim.carrier.cargo === "crate";
    if (seed.current) seed.current.visible = sim.carrier.cargo === "seed";
  });
  return (
    <>
      <group ref={crate} position-y={y} visible={false}>
        <Crate />
      </group>
      <group ref={seed} position-y={y + 0.06} visible={false}>
        <Crate seed />
      </group>
    </>
  );
}

function Lift({ sim }: SimProp) {
  const top = NFLOORS * FH;
  const plat = useRef<THREE.Group>(null);
  useFrame(() => {
    if (plat.current) plat.current.position.y = sim.carrier.y;
  });
  return (
    <group position={[LIFT_X, 0, 0]}>
      {[
        [-0.6, -0.7],
        [0.6, -0.7],
        [-0.6, 0.7],
        [0.6, 0.7],
      ].map(([x, z]) => (
        <mesh key={`${x}${z}`} position={[x, (top + 0.4) / 2, z]} castShadow>
          <boxGeometry args={[0.08, top + 0.4, 0.08]} />
          <meshStandardMaterial color={C.steel} />
        </mesh>
      ))}
      <mesh position={[0, top + 0.42, 0]}>
        <boxGeometry args={[1.4, 0.1, 1.6]} />
        <meshStandardMaterial color={C.steel} />
      </mesh>
      <group ref={plat}>
        <mesh position-y={0.05} castShadow receiveShadow>
          <boxGeometry args={[1.15, 0.1, 1.3]} />
          <meshStandardMaterial color={C.ink} />
        </mesh>
        <Cargo sim={sim} y={0.1} />
      </group>
    </group>
  );
}

/** A small floor robot that carries crates along a painted lane to the conveyor. */
function Cart({ sim, type }: SimProp & { type: FarmType }) {
  const g = useRef<THREE.Group>(null);
  const L = LAYOUTS[type];
  const zs = [0, ...L.units.map((_, k) => L.transfer(k)[2])];
  const z0 = Math.min(...zs) - 0.8;
  const z1 = Math.max(...zs) + 0.8;
  useFrame(() => {
    g.current?.position.set(sim.carrier.x, 0, sim.carrier.z);
  });
  return (
    <group>
      <mesh rotation-x={-Math.PI / 2} position={[LIFT_X, 0.008, (z0 + z1) / 2]} receiveShadow>
        <planeGeometry args={[1.4, z1 - z0]} />
        <meshStandardMaterial color="#dfe5ee" roughness={1} />
      </mesh>
      {[-0.68, 0.68].map((dx) => (
        <mesh key={dx} rotation-x={-Math.PI / 2} position={[LIFT_X + dx, 0.012, (z0 + z1) / 2]}>
          <planeGeometry args={[0.06, z1 - z0]} />
          <meshBasicMaterial color="#f5a524" />
        </mesh>
      ))}
      <group ref={g}>
        <mesh position-y={0.17} castShadow>
          <boxGeometry args={[1.05, 0.24, 1.2]} />
          <meshStandardMaterial color={C.ink} />
        </mesh>
        <mesh position={[0, 0.2, 0.61]}>
          <boxGeometry args={[0.7, 0.05, 0.01]} />
          <meshStandardMaterial color="#5eead4" emissive="#5eead4" emissiveIntensity={1.5} />
        </mesh>
        <Cargo sim={sim} y={0.29} />
      </group>
    </group>
  );
}

/* --------------------------- Packing hall ------------------------------ */

function Arm({ a, color, x, z }: { a: () => number; color: string; x: number; z: number }) {
  const yaw = useRef<THREE.Group>(null);
  const upper = useRef<THREE.Group>(null);
  useFrame(() => {
    const v = a();
    if (yaw.current) yaw.current.rotation.y = 0.6 + v * 1.5;
    if (upper.current) upper.current.rotation.z = -0.5 + v * 0.8;
  });
  return (
    <group position={[x, 0.1, z]}>
      <mesh position-y={0.15} castShadow>
        <cylinderGeometry args={[0.38, 0.45, 0.3, 24]} />
        <meshStandardMaterial color={C.ink} />
      </mesh>
      <group ref={yaw} position-y={0.3}>
        <mesh position-y={0.2} castShadow>
          <cylinderGeometry args={[0.22, 0.26, 0.4, 20]} />
          <meshStandardMaterial color={color} />
        </mesh>
        <group ref={upper} position-y={0.4}>
          <mesh position={[0.45, 0.35, 0]} rotation-z={-0.9} castShadow>
            <boxGeometry args={[0.18, 1.1, 0.18]} />
            <meshStandardMaterial color={color} />
          </mesh>
          <mesh position={[1.05, 0.55, 0]} rotation-z={0.6} castShadow>
            <boxGeometry args={[0.14, 0.8, 0.14]} />
            <meshStandardMaterial color={C.white} />
          </mesh>
          <mesh position={[1.3, 0.25, 0]}>
            <boxGeometry args={[0.28, 0.1, 0.28]} />
            <meshStandardMaterial color={C.ink} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

function Hall({ sim }: SimProp) {
  const moving = useRef<THREE.Group>(null);
  const tray = useRef<THREE.Group>(null);
  const stack = useRef<THREE.Group>(null);
  const panel = useRef<THREE.MeshStandardMaterial>(null);
  useFrame(() => {
    const c = sim.crate;
    if (moving.current) {
      moving.current.visible = c.visible;
      moving.current.position.set(c.x, c.y, c.z);
    }
    const t = sim.tray;
    if (tray.current) {
      tray.current.visible = t.visible;
      tray.current.position.set(t.x, t.y, t.z);
    }
    stack.current?.children.forEach((ch, i) => {
      ch.visible = i < sim.stack && !(sim.van.mode === "loading" && i >= sim.stack - Math.floor(sim.van.t / 0.6) - 1 && i >= sim.stack - 3);
    });
    if (panel.current) panel.current.emissiveIntensity = dayFactor(sim.hour) < 0.35 ? 1.4 : 0.15;
  });
  const conveyor = (from: [number, number], to: [number, number]) => {
    const [ax, az] = from;
    const [bx, bz] = to;
    const len = Math.hypot(bx - ax, bz - az) + 0.7;
    const rot = Math.atan2(-(bz - az), bx - ax);
    return (
      <group position={[(ax + bx) / 2, 0, (az + bz) / 2]} rotation-y={rot}>
        <mesh position-y={CONVEYOR_Y / 2} castShadow receiveShadow>
          <boxGeometry args={[len, CONVEYOR_Y, 0.75]} />
          <meshStandardMaterial color="#3b4459" />
        </mesh>
        {range(Math.floor(len / 0.45)).map((i) => (
          <mesh key={i} position={[-len / 2 + 0.25 + i * 0.45, CONVEYOR_Y + 0.005, 0]}>
            <boxGeometry args={[0.06, 0.01, 0.7]} />
            <meshStandardMaterial color="#596379" />
          </mesh>
        ))}
      </group>
    );
  };
  return (
    <group>
      <mesh position={[11, 0.05, 0.3]} receiveShadow>
        <boxGeometry args={[7.2, 0.1, 5.8]} />
        <meshStandardMaterial color={C.wall} />
      </mesh>
      <mesh position={[11, 1.2, -2.5]} castShadow receiveShadow>
        <boxGeometry args={[7.2, 2.4, 0.14]} />
        <meshStandardMaterial color={C.white} />
      </mesh>
      <mesh position={[11, 1.6, -2.42]}>
        <boxGeometry args={[4.2, 0.5, 0.02]} />
        <meshStandardMaterial ref={panel} color="#e9fbef" emissive="#7ee0a0" emissiveIntensity={0.15} />
      </mesh>
      {[7.6, 14.4].map((x) => (
        <mesh key={x} position={[x, 0.35, 0.3]}>
          <boxGeometry args={[0.06, 0.6, 5.8]} />
          <meshStandardMaterial color={C.glass} transparent opacity={0.5} />
        </mesh>
      ))}
      {conveyor([LIFT_X + 0.5, 0], [PACKER.x, 0])}
      {conveyor([PACKER.x, 0], [DOCK.x, 0])}
      {conveyor([DOCK.x, 0], [DOCK.x, DOCK.z - 0.6])}
      <Arm a={() => sim.packerA} color={C.green} x={PACKER.x} z={PACKER.z} />
      <Arm a={() => sim.seederA} color="#f5a524" x={SEEDER.x} z={SEEDER.z} />
      {range(3).map((i) => (
        <group key={i} position={[SEEDER.x - 1.2, 0.12 + i * 0.12, -1.9]}>
          <Crate seed />
        </group>
      ))}
      <group ref={moving}>
        <Crate />
      </group>
      <group ref={tray}>
        <Crate seed />
      </group>
      <group ref={stack}>
        {range(6).map((i) => (
          <group key={i} position={[DOCK.x - 1.6 + (i % 3) * 0.85, Math.floor(i / 3) * 0.42, DOCK.z + 0.2]}>
            <Crate />
          </group>
        ))}
      </group>
    </group>
  );
}

/* -------------------------------- Drone -------------------------------- */

function Drone({ sim }: SimProp) {
  const g = useRef<THREE.Group>(null);
  const rotors = useRef<THREE.Group>(null);
  const beam = useRef<THREE.Mesh>(null);
  const carry = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    const d = sim.drone;
    g.current?.position.set(d.x, d.y, d.z);
    if (g.current) g.current.rotation.z = sim.batch?.stage === "sweep" ? 0.12 : 0;
    rotors.current?.children.forEach((r) => (r.rotation.y += (sim.playing ? 40 : 0) * dt));
    if (beam.current) beam.current.visible = sim.batch?.stage === "sweep";
    if (carry.current) carry.current.visible = sim.batch?.stage === "drop";
  });
  return (
    <group>
      <mesh position={[HOME.x, 0.04, HOME.z]} receiveShadow>
        <cylinderGeometry args={[0.95, 0.95, 0.08, 32]} />
        <meshStandardMaterial color="#dfe5ee" />
      </mesh>
      <mesh position={[HOME.x, 0.09, HOME.z]} rotation-x={-Math.PI / 2}>
        <ringGeometry args={[0.55, 0.65, 32]} />
        <meshBasicMaterial color={C.green} />
      </mesh>
      <group ref={g}>
        <mesh castShadow>
          <boxGeometry args={[0.55, 0.16, 0.55]} />
          <meshStandardMaterial color={C.ink} />
        </mesh>
        <mesh position-y={-0.1}>
          <sphereGeometry args={[0.07, 10, 8]} />
          <meshStandardMaterial color="#5eead4" emissive="#5eead4" emissiveIntensity={2} />
        </mesh>
        <group ref={rotors}>
          {[
            [-0.45, -0.45],
            [0.45, -0.45],
            [-0.45, 0.45],
            [0.45, 0.45],
          ].map(([x, z]) => (
            <group key={`${x}${z}`} position={[x, 0.1, z]}>
              <mesh>
                <boxGeometry args={[0.5, 0.02, 0.06]} />
                <meshStandardMaterial color="#5b6478" />
              </mesh>
            </group>
          ))}
        </group>
        {[
          [-0.45, -0.45],
          [0.45, -0.45],
          [-0.45, 0.45],
          [0.45, 0.45],
        ].map(([x, z]) => (
          <mesh key={`r${x}${z}`} position={[x, 0.08, z]}>
            <cylinderGeometry args={[0.26, 0.26, 0.02, 20]} />
            <meshStandardMaterial color="#9aa6ba" transparent opacity={0.35} />
          </mesh>
        ))}
        <mesh ref={beam} position={[0, -0.55, -0.7]} rotation-x={0.9} visible={false}>
          <coneGeometry args={[0.55, 1.6, 20, 1, true]} />
          <meshBasicMaterial color="#5eead4" transparent opacity={0.22} side={THREE.DoubleSide} depthWrite={false} />
        </mesh>
        <group ref={carry} position-y={-0.55} visible={false}>
          <Crate />
        </group>
      </group>
    </group>
  );
}

/* --------------------------------- Van --------------------------------- */

function Van({ sim }: SimProp) {
  const g = useRef<THREE.Group>(null);
  const door = useRef<THREE.Mesh>(null);
  const lights = useRef<THREE.MeshStandardMaterial>(null);
  useFrame(() => {
    g.current?.position.set(sim.van.x, 0, VAN_Z);
    if (door.current) door.current.rotation.y = sim.van.mode === "loading" ? -1.4 : 0;
    if (lights.current) lights.current.emissiveIntensity = dayFactor(sim.hour) < 0.4 ? 3 : 0.2;
  });
  return (
    <group ref={g}>
      <mesh position={[-0.3, 1.0, 0]} castShadow>
        <boxGeometry args={[2.9, 1.5, 1.45]} />
        <meshStandardMaterial color={C.white} />
      </mesh>
      <mesh position={[-0.3, 0.75, 0.73]}>
        <boxGeometry args={[2.6, 0.22, 0.01]} />
        <meshStandardMaterial color={C.green} />
      </mesh>
      <mesh position={[1.55, 0.78, 0]} castShadow>
        <boxGeometry args={[0.9, 1.05, 1.4]} />
        <meshStandardMaterial color={C.green} />
      </mesh>
      <mesh position={[1.72, 1.05, 0]}>
        <boxGeometry args={[0.6, 0.4, 1.42]} />
        <meshStandardMaterial color="#1f2937" roughness={0.2} />
      </mesh>
      <mesh position={[2.01, 0.6, 0]}>
        <boxGeometry args={[0.02, 0.16, 1.2]} />
        <meshStandardMaterial ref={lights} color="#fff6dc" emissive="#ffe6a8" emissiveIntensity={0.2} />
      </mesh>
      <mesh ref={door} position={[-1.75, 1.0, -0.72]}>
        <boxGeometry args={[0.04, 1.4, 1.4]} />
        <meshStandardMaterial color="#eef1f6" />
      </mesh>
      {[
        [-1.1, 0.72],
        [1.3, 0.72],
        [-1.1, -0.72],
        [1.3, -0.72],
      ].map(([x, z]) => (
        <mesh key={`${x}${z}`} position={[x, 0.3, z]} rotation-x={Math.PI / 2} castShadow>
          <cylinderGeometry args={[0.3, 0.3, 0.2, 16]} />
          <meshStandardMaterial color={C.ink} />
        </mesh>
      ))}
    </group>
  );
}

/* ------------------------------- Grounds ------------------------------- */

const TREES: [number, number, number][] = [
  [-14, -5, 1.1],
  [-12, 1.5, 0.9],
  [-17, -1, 1.3],
  [-4, -7.5, 1],
  [3, -8, 1.2],
  [10, -6.5, 0.9],
  [17, -4, 1.2],
  [19.5, 1, 1],
  [-20, 3, 1],
  [22, -8, 1.3],
];

function Grounds({ type }: { type: FarmType }) {
  // Leave out trees that would grow through this farm's buildings or solar field.
  const clear = [...LAYOUTS[type].clear, ...(type === "tower" ? [] : [SOLAR_FIELD])];
  const trees = TREES.filter(([x, z, s]) => !clear.some(([x0, z0, x1, z1]) => x > x0 - s && x < x1 + s && z > z0 - s && z < z1 + s));
  return (
    <group>
      {trees.map(([x, z, s]) => (
        <group key={`${x}${z}`} position={[x, 0, z]} scale={s}>
          <mesh position-y={0.5} castShadow>
            <cylinderGeometry args={[0.1, 0.14, 1, 8]} />
            <meshStandardMaterial color="#a48868" />
          </mesh>
          <mesh position-y={1.45} castShadow>
            <icosahedronGeometry args={[0.85, 0]} />
            <meshStandardMaterial color="#69bb88" flatShading />
          </mesh>
          <mesh position={[0.35, 1.15, 0.3]} castShadow>
            <icosahedronGeometry args={[0.5, 0]} />
            <meshStandardMaterial color="#7fcb98" flatShading />
          </mesh>
        </group>
      ))}
      {[
        [-11, -3, 6, 9],
        [16, -3, 7, 6],
      ].map(([x, z, w, d]) => (
        <mesh key={`${x}`} rotation-x={-Math.PI / 2} position={[x, 0.004, z]} receiveShadow>
          <planeGeometry args={[w, d]} />
          <meshStandardMaterial color="#dcefe2" roughness={1} />
        </mesh>
      ))}
    </group>
  );
}

/* ------------------------------ Anchors ------------------------------ */

function Projector({ sim, anchors, type }: { sim: FarmSim; anchors: AnchorSink; type: FarmType }) {
  const { camera, size } = useThree();
  useFrame(() => {
    const L = LAYOUTS[type];
    const put = (key: string, x: number, y: number, z: number) => {
      _v.set(x, y, z).project(camera);
      anchors.set(key, ((_v.x + 1) / 2) * size.width, ((1 - _v.y) / 2) * size.height, _v.z < 1);
    };
    L.units.forEach(([x, y, z], k) => put(`f${k}`, x + L.tag[0], y + L.tag[1], z + L.tag[2]));
    const [ux, uy, uz] = L.units[sim.focus ?? sim.sel];
    L.sensors.forEach(([x, y, z], i) => put(`s${i}`, ux + x, uy + y, uz + z));
    anchors.flush();
  });
  return null;
}
