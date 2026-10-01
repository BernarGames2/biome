/**
 * Arte botânica em linha fina, gerada de forma determinística (sem aleatoriedade → SSR estável).
 * Usada como fallback elegante enquanto as fotos reais não chegam e como decoração.
 */
type Variant = "leaf" | "fern" | "sunflower" | "seed" | "stem";
type Tone = "musgo" | "areia" | "offwhite" | "carvao";

const palette: Record<Tone, { bg: string; line: string; accent: string; glow: string }> = {
  musgo: { bg: "#2f4a3a", line: "#efe6d6", accent: "#e0a83a", glow: "#6f8f5e" },
  areia: { bg: "#efe6d6", line: "#2f4a3a", accent: "#b4694a", glow: "#faf6ee" },
  offwhite: { bg: "#faf6ee", line: "#2f4a3a", accent: "#e0a83a", glow: "#efe6d6" },
  carvao: { bg: "#1b1b19", line: "#efe6d6", accent: "#e0a83a", glow: "#2f4a3a" },
};

const r = (n: number) => Math.round(n * 10) / 10;
const rad = (d: number) => (d * Math.PI) / 180;

function leafPath(cx: number, cy: number, len: number, w: number, angle: number) {
  // folha lanceolada a partir da base (cx,cy) na direção `angle`
  const a = rad(angle);
  const tx = cx + Math.cos(a) * len, ty = cy + Math.sin(a) * len;
  const nx = -Math.sin(a) * w, ny = Math.cos(a) * w;
  const m1x = cx + Math.cos(a) * len * 0.42, m1y = cy + Math.sin(a) * len * 0.42;
  return `M${r(cx)} ${r(cy)} Q${r(m1x + nx)} ${r(m1y + ny)} ${r(tx)} ${r(ty)} Q${r(m1x - nx)} ${r(m1y - ny)} ${r(cx)} ${r(cy)}Z`;
}

function BigLeaf({ c }: { c: (typeof palette)[Tone] }) {
  const veins: string[] = [];
  for (let i = 1; i <= 9; i++) {
    const t = i / 10.5;
    const y = 450 - t * 400;
    const x = 200 + Math.sin(t * 2.4) * 18;
    const span = Math.sin(t * Math.PI) * 120 + 10;
    veins.push(`M${r(x)} ${r(y)} Q${r(x - span * 0.5)} ${r(y - 18)} ${r(x - span)} ${r(y - 52)}`);
    veins.push(`M${r(x)} ${r(y)} Q${r(x + span * 0.5)} ${r(y - 18)} ${r(x + span)} ${r(y - 52)}`);
  }
  return (
    <g stroke={c.line} fill="none" strokeLinecap="round">
      <path d="M200 470 C 40 380, 50 140, 205 30 C 350 150, 360 380, 200 470Z" strokeWidth="1.4" opacity=".9" />
      <path d="M200 498 L200 470 Q 214 260 205 30" strokeWidth="1.2" opacity=".9" />
      {veins.map((d, i) => <path key={i} d={d} strokeWidth=".8" opacity=".55" />)}
    </g>
  );
}

function Fern({ c }: { c: (typeof palette)[Tone] }) {
  const leaves: string[] = [];
  const N = 22;
  for (let i = 0; i < N; i++) {
    const t = i / N;
    // ráquis curva
    const x = 120 + t * 200 + Math.sin(t * 3) * 30;
    const y = 490 - t * 450;
    const len = 26 + Math.sin(t * Math.PI) * 70;
    const ang = -100 + t * 50;
    leaves.push(leafPath(x, y, len, len * 0.22, ang - 62));
    leaves.push(leafPath(x, y, len, len * 0.22, ang + 62));
  }
  const rachis = Array.from({ length: 30 }, (_, i) => {
    const t = i / 29;
    return `${i ? "L" : "M"}${r(120 + t * 200 + Math.sin(t * 3) * 30)} ${r(490 - t * 450)}`;
  }).join(" ");
  return (
    <g stroke={c.line} fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d={rachis} strokeWidth="1.3" />
      {leaves.map((d, i) => <path key={i} d={d} strokeWidth=".9" opacity={0.55 + (i % 4) * 0.1} />)}
    </g>
  );
}

function Sunflower({ c }: { c: (typeof palette)[Tone] }) {
  const cx = 210, cy = 180;
  const petals = Array.from({ length: 24 }, (_, i) => leafPath(cx, cy, 120 + (i % 2) * 12, 20, (360 / 24) * i + (i % 2) * 7));
  const seeds = Array.from({ length: 160 }, (_, i) => {
    const ang = i * 137.508;
    const rr = 4.4 * Math.sqrt(i);
    return { x: r(cx + Math.cos(rad(ang)) * rr), y: r(cy + Math.sin(rad(ang)) * rr), s: r(1 + i / 160) };
  });
  return (
    <g fill="none" strokeLinecap="round">
      <path d={`M${cx} ${cy + 60} C 200 330, 230 420, 205 510`} stroke={c.line} strokeWidth="1.3" />
      <path d={leafPath(208, 380, 120, 30, -160)} stroke={c.line} strokeWidth="1" opacity=".8" />
      <path d={leafPath(214, 330, 100, 26, -20)} stroke={c.line} strokeWidth="1" opacity=".8" />
      {petals.map((d, i) => <path key={i} d={d} stroke={c.accent} strokeWidth="1" opacity=".85" />)}
      <circle cx={cx} cy={cy} r="58" fill={c.bg} stroke={c.line} strokeWidth="1" />
      {seeds.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={p.s} fill={c.line} opacity=".7" />)}
    </g>
  );
}

function Seeds({ c }: { c: (typeof palette)[Tone] }) {
  const pods = [
    { x: 130, y: 150, s: 1 },
    { x: 280, y: 260, s: 1.35 },
    { x: 150, y: 380, s: 0.8 },
  ];
  return (
    <g fill="none" strokeLinecap="round" stroke={c.line}>
      {pods.map((p, k) => (
        <g key={k} transform={`translate(${p.x} ${p.y}) scale(${p.s})`}>
          <path d="M0 -70 C 46 -40, 46 40, 0 72 C -46 40, -46 -40, 0 -70Z" strokeWidth="1.2" />
          <path d="M0 -70 L0 72" strokeWidth=".8" opacity=".6" />
          {Array.from({ length: 7 }, (_, i) => {
            const y = -50 + i * 16;
            const w = Math.sqrt(Math.max(0, 1 - (y / 72) ** 2)) * 30;
            return <path key={i} d={`M0 ${y} Q ${r(w)} ${y + 6} ${r(w * 1.2)} ${y + 16} M0 ${y} Q ${r(-w)} ${y + 6} ${r(-w * 1.2)} ${y + 16}`} strokeWidth=".7" opacity=".5" />;
          })}
        </g>
      ))}
      {Array.from({ length: 26 }, (_, i) => {
        const x = r(40 + ((i * 97) % 330));
        const y = r(40 + ((i * 53) % 430));
        return <ellipse key={i} cx={x} cy={y} rx="2.4" ry="5" transform={`rotate(${(i * 41) % 180} ${x} ${y})`} fill={c.accent} stroke="none" opacity=".55" />;
      })}
    </g>
  );
}

function Stem({ c }: { c: (typeof palette)[Tone] }) {
  const pts = Array.from({ length: 12 }, (_, i) => {
    const t = i / 11;
    return { x: 90 + t * 230 + Math.sin(t * 5) * 22, y: 500 - t * 470, t };
  });
  const path = pts.map((p, i) => `${i ? "L" : "M"}${r(p.x)} ${r(p.y)}`).join(" ");
  return (
    <g fill="none" stroke={c.line} strokeLinecap="round">
      <path d={path} strokeWidth="1.3" />
      {pts.slice(1, -1).map((p, i) => {
        const side = i % 2 ? 1 : -1;
        const size = 34 + Math.sin(p.t * Math.PI) * 30;
        const cx = p.x + side * size * 0.7, cy = p.y - size * 0.25;
        return (
          <g key={i}>
            <ellipse cx={r(cx)} cy={r(cy)} rx={r(size * 0.62)} ry={r(size * 0.42)} transform={`rotate(${side * -24} ${r(cx)} ${r(cy)})`} strokeWidth=".95" opacity=".8" />
            <path d={`M${r(p.x)} ${r(p.y)} L${r(cx + side * size * 0.5)} ${r(cy - size * 0.18)}`} strokeWidth=".6" opacity=".5" />
          </g>
        );
      })}
      <circle cx={r(pts[11].x)} cy={r(pts[11].y)} r="5" fill={c.accent} stroke="none" />
    </g>
  );
}

export function BotanicalArt({ variant = "leaf", tone = "musgo", className = "", label }: { variant?: Variant; tone?: Tone; className?: string; label?: string }) {
  const c = palette[tone];
  const id = `g-${variant}-${tone}`;
  return (
    <svg viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" className={`h-full w-full ${className}`} role={label ? "img" : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
      <defs>
        <radialGradient id={id} cx="72%" cy="18%" r="80%">
          <stop offset="0" stopColor={c.glow} stopOpacity=".55" />
          <stop offset="1" stopColor={c.bg} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="400" height="500" fill={c.bg} />
      <rect width="400" height="500" fill={`url(#${id})`} />
      {variant === "leaf" && <BigLeaf c={c} />}
      {variant === "fern" && <Fern c={c} />}
      {variant === "sunflower" && <Sunflower c={c} />}
      {variant === "seed" && <Seeds c={c} />}
      {variant === "stem" && <Stem c={c} />}
    </svg>
  );
}
