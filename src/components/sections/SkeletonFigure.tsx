import { useId } from "react";

/**
 * Static front-facing holographic skeleton.
 * viewBox 0 0 100 200 maps 1:1 to percentage positions on the
 * InteractiveBody container (y = percent * 2).
 *
 * Joint anchors (must stay under existing hotspots):
 *   shoulder 32,22 -> (32, 44)
 *   elbow    22,35 -> (22, 70)
 *   spine    50,30 -> (50, 60)
 *   wrist    15,48 -> (15, 96)
 *   hip      42,48 -> (42, 96)
 *   knee     42,72 -> (42, 144)
 *   ankle    44,92 -> (44, 184)
 */
const L = {
  shoulder: { x: 32, y: 44 },
  elbow: { x: 22, y: 70 },
  wrist: { x: 15, y: 96 },
  hip: { x: 42, y: 96 },
  knee: { x: 42, y: 144 },
  ankle: { x: 44, y: 184 },
};

function unit(x1: number, y1: number, x2: number, y2: number) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  return { dx, dy, len, ux: dx / len, uy: dy / len, px: -dy / len, py: dx / len };
}

function longBonePath(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  headR: number,
  shaftW: number,
  distalW: number,
) {
  const { ux, uy, px, py, len } = unit(x1, y1, x2, y2);
  const start = headR * 0.55;
  const end = Math.min(2.2, len * 0.08);
  const sx = x1 + ux * start;
  const sy = y1 + uy * start;
  const ex = x2 - ux * end;
  const ey = y2 - uy * end;
  const midX = (sx + ex) / 2;
  const midY = (sy + ey) / 2;
  const sw = shaftW / 2;
  const dw = distalW / 2;
  const nw = sw * 0.75;
  return [
    `M ${sx + px * nw} ${sy + py * nw}`,
    `C ${sx + px * sw} ${sy + py * sw}, ${midX + px * sw} ${midY + py * sw}, ${ex + px * dw} ${ey + py * dw}`,
    `L ${ex - px * dw} ${ey - py * dw}`,
    `C ${midX - px * sw} ${midY - py * sw}, ${sx - px * sw} ${sy - py * sw}, ${sx - px * nw} ${sy - py * nw}`,
    "Z",
  ].join(" ");
}

function ribPath(index: number) {
  const yV = 45.6 + index * 3.05;
  const xV = 47.7;
  let xOut: number;
  let yOut: number;
  let xEnd: number;
  let yEnd: number;
  if (index < 7) {
    const t = index / 6;
    xOut = 50 - (8.2 + Math.sin(t * Math.PI) * 7.4);
    yOut = yV + 2.4 + t * 2;
    xEnd = 50 - (index < 2 ? 1.7 : 1.25);
    yEnd = 47.2 + index * 3.35;
  } else if (index < 10) {
    const k = index - 7;
    xOut = 50 - (15.6 - k * 1.1);
    yOut = yV + 4.5;
    xEnd = 50 - (5 + k * 2.4);
    yEnd = 74 + k * 3.6;
  } else {
    const k = index - 10;
    xOut = 50 - (10.5 - k * 2.2);
    yOut = yV + 4;
    xEnd = 50 - (8.5 - k * 2);
    yEnd = yV + 5.5;
  }
  return `M ${xV} ${yV} C ${xOut} ${yV + 0.4}, ${xOut} ${yOut}, ${xEnd} ${yEnd}`;
}

function Hand() {
  const { x, y } = L.wrist;
  const { ux, uy } = unit(L.elbow.x, L.elbow.y, x, y);
  let lx = -uy;
  let ly = ux;
  if (lx * (50 - x) > 0) {
    lx = -lx;
    ly = -ly;
  }

  const palm = [
    `M ${x - ux * 0.4 + lx * 1.7} ${y - uy * 0.4 + ly * 1.7}`,
    `L ${x + ux * 0.5 + lx * 2.35} ${y + uy * 0.5 + ly * 2.35}`,
    `L ${x + ux * 4.6 + lx * 2.15} ${y + uy * 4.6 + ly * 2.15}`,
    `L ${x + ux * 5.0 + lx * 0.15} ${y + uy * 5.0 + ly * 0.15}`,
    `L ${x + ux * 4.4 - lx * 1.85} ${y + uy * 4.4 - ly * 1.85}`,
    `L ${x + ux * 0.6 - lx * 1.7} ${y + uy * 0.6 - ly * 1.7}`,
    "Z",
  ].join(" ");

  // index, middle, ring, pinky: spread is lateral(+) to medial(-)
  const fingers = [
    { spread: 1.55, length: 6.6, mid: 2.6, tipW: 0.55 },
    { spread: 0.45, length: 7.5, mid: 2.9, tipW: 0.58 },
    { spread: -0.55, length: 6.8, mid: 2.7, tipW: 0.52 },
    { spread: -1.45, length: 5.3, mid: 2.2, tipW: 0.42 },
  ];

  const tux = (ux * 0.35 + lx * 0.94);
  const tuy = (uy * 0.35 + ly * 0.94);
  const tLen = Math.hypot(tux, tuy) || 1;
  const thuX = tux / tLen;
  const thuY = tuy / tLen;
  const thumbBaseX = x + ux * 1.05 + lx * 2.15;
  const thumbBaseY = y + uy * 1.05 + ly * 2.15;

  return (
    <g>
      <path d={palm} strokeWidth={0.5} />
      {/* carpals */}
      <ellipse
        cx={x + ux * 0.85}
        cy={y + uy * 0.85}
        rx={1.55}
        ry={1.05}
        transform={`rotate(${(Math.atan2(uy, ux) * 180) / Math.PI} ${x + ux * 0.85} ${y + uy * 0.85})`}
        strokeWidth={0.45}
      />
      {fingers.map((f, i) => {
        const baseX = x + ux * 4.7 + lx * f.spread;
        const baseY = y + uy * 4.7 + ly * f.spread;
        const fux = ux + lx * f.spread * 0.06;
        const fuy = uy + ly * f.spread * 0.06;
        const fl = Math.hypot(fux, fuy) || 1;
        const vx = fux / fl;
        const vy = fuy / fl;
        const j1x = baseX + vx * f.mid;
        const j1y = baseY + vy * f.mid;
        const j2x = baseX + vx * (f.mid + (f.length - f.mid) * 0.52);
        const j2y = baseY + vy * (f.mid + (f.length - f.mid) * 0.52);
        const tx = baseX + vx * f.length;
        const ty = baseY + vy * f.length;
        return (
          <g key={i}>
            <path
              d={`M ${baseX} ${baseY} L ${j1x} ${j1y} L ${j2x} ${j2y} L ${tx} ${ty}`}
              fill="none"
              strokeWidth={0.55}
            />
            <circle cx={baseX} cy={baseY} r={0.38} />
            <circle cx={j1x} cy={j1y} r={0.32} />
            <circle cx={j2x} cy={j2y} r={0.28} />
            <ellipse cx={tx} cy={ty} rx={f.tipW * 0.55} ry={0.4} />
          </g>
        );
      })}
      <path
        d={`M ${thumbBaseX} ${thumbBaseY}
            L ${thumbBaseX + thuX * 2.3} ${thumbBaseY + thuY * 2.3}
            L ${thumbBaseX + thuX * 4.0} ${thumbBaseY + thuY * 4.0}`}
        fill="none"
        strokeWidth={0.58}
      />
      <circle cx={thumbBaseX} cy={thumbBaseY} r={0.42} />
      <circle cx={thumbBaseX + thuX * 2.3} cy={thumbBaseY + thuY * 2.3} r={0.34} />
      <ellipse cx={thumbBaseX + thuX * 4.0} cy={thumbBaseY + thuY * 4.0} rx={0.38} ry={0.42} />
    </g>
  );
}

function Foot() {
  const { x, y } = L.ankle;
  // Foreshortened anterior view, slight external rotation.
  // Lateral is away from midline (smaller x on the left foot).
  const outline = [
    `M ${x - 2.05} ${y + 0.55}`,
    `C ${x - 3.5} ${y + 2.8}, ${x - 4.7} ${y + 6.2}, ${x - 5.05} ${y + 8.8}`,
    `C ${x - 5.25} ${y + 10.5}, ${x - 4.55} ${y + 11.85}, ${x - 3.1} ${y + 12.25}`,
    `C ${x - 1.7} ${y + 12.65}, ${x - 0.15} ${y + 12.85}, ${x + 1.55} ${y + 12.55}`,
    `C ${x + 3.15} ${y + 12.25}, ${x + 4.35} ${y + 11.35}, ${x + 4.25} ${y + 9.7}`,
    `C ${x + 4.05} ${y + 6.5}, ${x + 2.7} ${y + 2.9}, ${x + 2.05} ${y + 0.55}`,
    `C ${x + 1.2} ${y - 0.7}, ${x - 1.2} ${y - 0.7}, ${x - 2.05} ${y + 0.55}`,
    "Z",
  ].join(" ");

  // Toes along the distal margin, little toe (lateral) to hallux (medial)
  const toes = [
    { ox: -4.15, oy: 10.7, rx: 0.42, ry: 0.7 },
    { ox: -2.55, oy: 11.55, rx: 0.48, ry: 0.82 },
    { ox: -0.85, oy: 12.05, rx: 0.52, ry: 0.9 },
    { ox: 0.85, oy: 12.15, rx: 0.5, ry: 0.88 },
    { ox: 2.55, oy: 11.55, rx: 0.7, ry: 1.05 }, // hallux, medial
  ];

  return (
    <g>
      <path d={outline} strokeWidth={0.55} />
      {/* talus */}
      <ellipse cx={x} cy={y + 1.15} rx={1.65} ry={1.2} strokeWidth={0.45} />
      {/* calcaneus / midfoot mass */}
      <ellipse cx={x + 0.15} cy={y + 4.4} rx={2.15} ry={1.7} strokeWidth={0.45} />
      {/* metatarsal hints */}
      {toes.map((t, i) => (
        <line
          key={`m${i}`}
          x1={x + t.ox * 0.28}
          y1={y + 5.6}
          x2={x + t.ox * 0.92}
          y2={y + t.oy - t.ry * 0.7}
          strokeWidth={0.4}
        />
      ))}
      {toes.map((t, i) => (
        <ellipse key={`t${i}`} cx={x + t.ox} cy={y + t.oy} rx={t.rx} ry={t.ry} strokeWidth={0.4} />
      ))}
    </g>
  );
}

function LeftExtremities() {
  const humerus = longBonePath(L.shoulder.x, L.shoulder.y, L.elbow.x, L.elbow.y, 3.1, 1.7, 2.6);
  const { ux: aux, uy: auy, px: apx, py: apy } = unit(L.elbow.x, L.elbow.y, L.wrist.x, L.wrist.y);
  // radius is lateral (thumb side), ulna is medial
  let latX = apx;
  let latY = apy;
  if (latX * (50 - L.wrist.x) > 0) {
    latX = -latX;
    latY = -latY;
  }
  const ulnaOff = -0.55;
  const radOff = 0.55;
  const ulnaX1 = L.elbow.x + latX * ulnaOff;
  const ulnaY1 = L.elbow.y + latY * ulnaOff;
  const ulnaX2 = L.wrist.x + latX * ulnaOff * 0.7;
  const ulnaY2 = L.wrist.y + latY * ulnaOff * 0.7;
  const radX1 = L.elbow.x + latX * radOff;
  const radY1 = L.elbow.y + latY * radOff + auy * 1.2;
  const radX2 = L.wrist.x + latX * radOff * 0.9;
  const radY2 = L.wrist.y + latY * radOff * 0.9;

  const femur = longBonePath(L.hip.x, L.hip.y, L.knee.x, L.knee.y, 3.2, 2.0, 3.2);
  const { ux: tux, uy: tuy, px: tpx, py: tpy } = unit(L.knee.x, L.knee.y, L.ankle.x, L.ankle.y);
  let tLatX = tpx;
  let tLatY = tpy;
  if (tLatX * (50 - L.ankle.x) > 0) {
    tLatX = -tLatX;
    tLatY = -tLatY;
  }
  const tibia = longBonePath(
    L.knee.x - tLatX * 0.35,
    L.knee.y + tuy * 2.4,
    L.ankle.x - tLatX * 0.35,
    L.ankle.y - tuy * 1.2,
    0.2,
    1.7,
    2.2,
  );
  const fibX1 = L.knee.x + tLatX * 1.55;
  const fibY1 = L.knee.y + tuy * 3.6;
  const fibX2 = L.ankle.x + tLatX * 1.55;
  const fibY2 = L.ankle.y - tuy * 0.6;

  return (
    <g>
      {/* Scapula (front hint: acromion / glenoid / coracoid) */}
      <path
        d={`M ${L.shoulder.x + 1.2} ${L.shoulder.y - 1.6}
            C ${L.shoulder.x + 4.5} ${L.shoulder.y - 3.2}, ${L.shoulder.x + 7.2} ${L.shoulder.y + 1.2}, ${L.shoulder.x + 6.4} ${L.shoulder.y + 6.5}
            C ${L.shoulder.x + 5.2} ${L.shoulder.y + 9.5}, ${L.shoulder.x + 2.8} ${L.shoulder.y + 8.2}, ${L.shoulder.x + 2.2} ${L.shoulder.y + 5.5}
            C ${L.shoulder.x + 1.6} ${L.shoulder.y + 3}, ${L.shoulder.x + 1.4} ${L.shoulder.y + 0.6}, ${L.shoulder.x + 1.2} ${L.shoulder.y - 1.6}
            Z`}
      />
      <path
        d={`M ${L.shoulder.x - 0.2} ${L.shoulder.y - 2.4}
            C ${L.shoulder.x + 2.4} ${L.shoulder.y - 3.8}, ${L.shoulder.x + 5} ${L.shoulder.y - 2.8}, ${L.shoulder.x + 5.8} ${L.shoulder.y - 1}
            `}
        fill="none"
      />

      {/* Clavicle */}
      <path
        d={`M 50 43.2 C 44 41.8, 38 42.4, ${L.shoulder.x} ${L.shoulder.y - 0.8}`}
        fill="none"
        strokeWidth={0.7}
      />

      {/* Humerus */}
      <circle cx={L.shoulder.x} cy={L.shoulder.y} r={3.05} />
      <path d={humerus} />
      {/* elbow condyles */}
      <ellipse
        cx={L.elbow.x}
        cy={L.elbow.y}
        rx={2.15}
        ry={1.55}
        transform={`rotate(${(Math.atan2(L.elbow.y - L.shoulder.y, L.elbow.x - L.shoulder.x) * 180) / Math.PI} ${L.elbow.x} ${L.elbow.y})`}
      />

      {/* Ulna + radius */}
      <path d={longBonePath(ulnaX1, ulnaY1, ulnaX2, ulnaY2, 0.8, 1.05, 1.15)} />
      <path d={longBonePath(radX1, radY1, radX2, radY2, 0.7, 1.05, 1.25)} />
      <circle cx={ulnaX1} cy={ulnaY1} r={0.85} />
      <circle cx={radX1} cy={radY1} r={0.7} />
      <circle cx={L.wrist.x} cy={L.wrist.y} r={1.15} />

      <Hand />

      {/* Pelvis half: ilium, acetabulum, pubic/ischial rami */}
      <path
        d={`M 49 87.5
            C 46 86.2, 41.5 85.6, 37.6 87.4
            C 34.8 89, 34.2 91.8, 35.2 94.6
            C 36 96.8, 38.2 98.2, 40.4 98.6
            C 39.4 100.4, 38.6 103.2, 39.6 106
            C 41.2 109.2, 45.2 110.4, 49.2 108.6
            C 48.6 106.2, 48.4 103.6, 49 101.5
            C 47.2 101.8, 45.2 102.2, 43.8 103.6
            C 42.6 102, 42.2 99.6, 42.4 97.8
            C 44.6 96.2, 47.2 95.2, 49.2 94.6
            C 49 92.2, 49.2 89.6, 49 87.5
            Z`}
      />
      <circle cx={L.hip.x} cy={L.hip.y} r={3.35} fill="none" strokeWidth={0.7} />

      {/* Femur */}
      <circle cx={L.hip.x} cy={L.hip.y} r={2.7} />
      {/* greater trochanter */}
      <ellipse cx={L.hip.x - 2.8} cy={L.hip.y + 1.6} rx={1.15} ry={1.6} />
      <path
        d={`M ${L.hip.x - 0.4} ${L.hip.y + 1} Q ${L.hip.x - 2.2} ${L.hip.y + 1.2}, ${L.hip.x - 2.6} ${L.hip.y + 2.2}`}
        fill="none"
      />
      <path d={femur} />
      {/* distal femoral condyles */}
      <ellipse cx={L.knee.x - 1.35} cy={L.knee.y + 0.6} rx={1.45} ry={1.7} />
      <ellipse cx={L.knee.x + 1.35} cy={L.knee.y + 0.6} rx={1.45} ry={1.7} />

      {/* Patella */}
      <ellipse cx={L.knee.x} cy={L.knee.y - 0.15} rx={1.85} ry={2.25} strokeWidth={0.7} />

      {/* Tibia + fibula */}
      <path d={tibia} />
      <path d={`M ${L.knee.x - 2.2} ${L.knee.y + 2.1} L ${L.knee.x + 2.2} ${L.knee.y + 2.1}`} fill="none" strokeWidth={0.7} />
      <line x1={fibX1} y1={fibY1} x2={fibX2} y2={fibY2} strokeWidth={0.7} />
      <circle cx={fibX1} cy={fibY1} r={0.7} />
      <circle cx={fibX2} cy={fibY2} r={0.7} />
      {/* malleoli */}
      <circle cx={L.ankle.x - tLatX * 1.5} cy={L.ankle.y} r={0.9} />
      <circle cx={L.ankle.x + tLatX * 1.5} cy={L.ankle.y} r={0.8} />

      <Foot />
    </g>
  );
}

function AxialSkeleton() {
  const cervical = Array.from({ length: 7 }, (_, i) => ({
    cy: 37.3 + i * 0.92,
    w: 2.5 + (i > 4 ? 0.4 : 0),
    h: 0.7,
  }));
  const thoracic = Array.from({ length: 12 }, (_, i) => ({
    cy: 44.5 + i * 3.0,
    w: 3.6 + Math.min(i, 11 - i) * 0.08,
    h: 1.85,
  }));
  const lumbar = Array.from({ length: 5 }, (_, i) => ({
    cy: 80.4 + i * 2.7,
    w: 4.6 + i * 0.18,
    h: 2.15,
  }));

  return (
    <g>
      {/* Skull */}
      <path
        d="M 50 9.6
           C 55.2 9.5, 59.6 12.0, 61.4 16.6
           C 62.8 20.2, 62.8 24.0, 61.8 26.8
           C 62.8 27.6, 63.2 29.0, 62.4 30.2
           C 61.6 31.2, 60.2 31.4, 59.0 31.2
           L 58.2 32.0
           C 57.8 33.8, 55.6 35.8, 52.4 36.6
           C 51.2 37.0, 50 37.2, 50 37.2
           C 50 37.2, 48.8 37.0, 47.6 36.6
           C 44.4 35.8, 42.2 33.8, 41.8 32.0
           L 41.0 31.2
           C 39.8 31.4, 38.4 31.2, 37.6 30.2
           C 36.8 29.0, 37.2 27.6, 38.2 26.8
           C 37.2 24.0, 37.2 20.2, 38.6 16.6
           C 40.4 12.0, 44.8 9.5, 50 9.6
           Z"
      />
      {/* sutures */}
      <path d="M 50 9.8 C 49.7 14.8, 50.3 18.6, 50 21.4" fill="none" strokeWidth={0.2} opacity={0.55} />
      <path d="M 42.4 18.8 C 45.6 17.6, 54.4 17.6, 57.6 18.8" fill="none" strokeWidth={0.2} opacity={0.55} />
      {/* zygomatic arches — slight wings, connected like cheekbones not ears */}
      <path d="M 38.6 27.0 C 36.8 27.6, 36.2 29.2, 37.4 30.4 C 38.4 31.2, 40.2 31.0, 41.2 30.4" fill="none" strokeWidth={0.45} />
      <path d="M 61.4 27.0 C 63.2 27.6, 63.8 29.2, 62.6 30.4 C 61.6 31.2, 59.8 31.0, 58.8 30.4" fill="none" strokeWidth={0.45} />
      {/* hollow orbits */}
      <path
        d="M 42.6 20.4 C 43.4 18.9, 47.2 18.8, 48.2 20.6 C 48.6 21.6, 47.6 23.4, 45.4 23.6 C 43.3 23.8, 42.2 22.0, 42.6 20.4 Z"
        fill="#020617"
        fillOpacity={0.88}
        strokeWidth={0.5}
      />
      <path
        d="M 57.4 20.4 C 56.6 18.9, 52.8 18.8, 51.8 20.6 C 51.4 21.6, 52.4 23.4, 54.6 23.6 C 56.7 23.8, 57.8 22.0, 57.4 20.4 Z"
        fill="#020617"
        fillOpacity={0.88}
        strokeWidth={0.5}
      />
      {/* piriform nasal aperture as a cavity, not a protruding nose */}
      <path
        d="M 50 23.0
           C 49.15 24.6, 48.15 26.6, 47.85 28.0
           C 47.7 28.7, 48.5 29.3, 50 29.3
           C 51.5 29.3, 52.3 28.7, 52.15 28.0
           C 51.85 26.6, 50.85 24.6, 50 23.0 Z"
        fill="#020617"
        fillOpacity={0.88}
        strokeWidth={0.45}
      />
      {/* maxilla / teeth — flat arcade, not a smile */}
      <path d="M 46.6 31.0 H 53.4" fill="none" strokeWidth={0.4} />
      <path d="M 47.0 31.0 V 32.0 M 48.1 31.0 V 32.15 M 49.2 31.0 V 32.2 M 50.0 31.0 V 32.2 M 50.8 31.0 V 32.2 M 51.9 31.0 V 32.15 M 53.0 31.0 V 32.0" fill="none" strokeWidth={0.22} />
      {/* mandible — more angular gonial corners */}
      <path d="M 41.4 31.6 L 41.0 33.4 C 41.0 35.2, 43.8 36.6, 50 36.8 C 56.2 36.6, 59.0 35.2, 59.0 33.4 L 58.6 31.6" fill="none" strokeWidth={0.55} />
      <path d="M 48.6 36.4 L 50 37.0 L 51.4 36.4" fill="none" strokeWidth={0.35} />

      {/* Hyoid hint */}
      <path d="M 47.4 39.2 Q 50 40 52.6 39.2" fill="none" strokeWidth={0.35} />

      {cervical.map((v, i) => (
        <rect key={`c${i}`} x={50 - v.w / 2} y={v.cy - v.h / 2} width={v.w} height={v.h} rx={0.25} />
      ))}
      {thoracic.map((v, i) => (
        <g key={`t${i}`}>
          <rect x={50 - v.w / 2} y={v.cy - v.h / 2} width={v.w} height={v.h} rx={0.3} />
          <line x1={50} y1={v.cy - 0.45} x2={50} y2={v.cy + 0.45} strokeWidth={0.3} />
        </g>
      ))}
      {lumbar.map((v, i) => (
        <g key={`l${i}`}>
          <rect x={50 - v.w / 2} y={v.cy - v.h / 2} width={v.w} height={v.h} rx={0.35} />
          <line x1={50} y1={v.cy - 0.55} x2={50} y2={v.cy + 0.55} strokeWidth={0.35} />
        </g>
      ))}

      {/* Sacrum + coccyx */}
      <path
        d="M 46.2 93.6
           L 53.8 93.6
           C 54.6 97.8, 53.6 102.6, 51.6 106.4
           L 50 108.8
           L 48.4 106.4
           C 46.4 102.6, 45.4 97.8, 46.2 93.6
           Z"
      />
      <path d="M 47.4 96.2 H 52.6 M 47.8 99.2 H 52.2 M 48.3 102.2 H 51.7 M 48.8 105 H 51.2" fill="none" strokeWidth={0.28} />
      <path d="M 49.2 108.6 Q 50 111.2 50.8 108.6" fill="none" strokeWidth={0.4} />

      {/* Sternum */}
      <path d="M 48.2 44.2 C 48.2 43.2, 51.8 43.2, 51.8 44.2 L 51.5 47.8 L 48.5 47.8 Z" />
      <path d="M 48.7 48.2 L 51.3 48.2 L 50.7 70.8 L 49.3 70.8 Z" />
      <path d="M 49.4 71.2 L 50.6 71.2 L 50 73.6 Z" />

      {/* Ribs (left drawn here; right comes from the mirrored group, so only left? 
          No — axial is not mirrored. Draw both sides.) */}
      {Array.from({ length: 12 }, (_, i) => (
        <g key={`rib${i}`}>
          <path d={ribPath(i)} fill="none" strokeWidth={i < 10 ? 0.55 : 0.42} />
          <path
            d={ribPath(i).replace(/M ([\d.]+) /g, (_, x) => `M ${100 - Number(x)} `).replace(/C ([\d.]+) ([\d.]+), ([\d.]+) ([\d.]+), ([\d.]+)/g, (_, x1, y1, x2, y2, x3) => `C ${100 - Number(x1)} ${y1}, ${100 - Number(x2)} ${y2}, ${100 - Number(x3)}`)}
            fill="none"
            strokeWidth={i < 10 ? 0.55 : 0.42}
          />
        </g>
      ))}
    </g>
  );
}

export default function SkeletonFigure({ className = "" }: { className?: string }) {
  const rawId = useId().replace(/:/g, "");
  const glowId = `skel-glow-${rawId}`;
  const softId = `skel-soft-${rawId}`;
  const fillId = `skel-fill-${rawId}`;
  const strokeId = `skel-stroke-${rawId}`;

  const boneFill = {
    fill: `url(#${fillId})`,
    stroke: `url(#${strokeId})`,
    strokeWidth: 0.55,
    strokeLinejoin: "round" as const,
    strokeLinecap: "round" as const,
  };

  return (
    <svg
      viewBox="0 0 100 200"
      preserveAspectRatio="none"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={strokeId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#99f6e4" />
          <stop offset="45%" stopColor="#5eead4" />
          <stop offset="100%" stopColor="#22d3ee" />
        </linearGradient>
        <linearGradient id={fillId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#5eead4" stopOpacity="0.28" />
          <stop offset="60%" stopColor="#14b8a6" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#155e75" stopOpacity="0.06" />
        </linearGradient>
        <filter id={glowId} x="-40%" y="-10%" width="180%" height="120%">
          <feGaussianBlur stdDeviation="1.15" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id={softId} x="-50%" y="-10%" width="200%" height="120%">
          <feGaussianBlur stdDeviation="2.4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
          </feMerge>
        </filter>
      </defs>

      {/* Soft under-glow copy */}
      <g
        filter={`url(#${softId})`}
        fill="none"
        stroke="#2dd4bf"
        strokeWidth={1.4}
        strokeLinejoin="round"
        strokeLinecap="round"
        opacity={0.55}
      >
        <g transform="translate(-0.2, 0)">
          <AxialSkeleton />
          <LeftExtremities />
          <g transform="translate(100, 0) scale(-1, 1)">
            <LeftExtremities />
          </g>
        </g>
      </g>

      {/* Crisp anatomy */}
      <g filter={`url(#${glowId})`} {...boneFill}>
        <AxialSkeleton />
        <LeftExtremities />
        <g transform="translate(100, 0) scale(-1, 1)">
          <LeftExtremities />
        </g>
      </g>
    </svg>
  );
}
