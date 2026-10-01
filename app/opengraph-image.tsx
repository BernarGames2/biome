import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const alt = "Bioma Evidence · Beleza natural como rotina · Uberlândia";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

async function loadFraunces(): Promise<ArrayBuffer | null> {
  try {
    const css = await (await fetch("https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@144,300&display=swap", { headers: { "User-Agent": "Mozilla/5.0" } })).text();
    const url = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/)?.[1];
    return url ? await (await fetch(url)).arrayBuffer() : null;
  } catch {
    return null;
  }
}

export default async function OG() {
  const font = await loadFraunces();
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#2f4a3a", color: "#faf6ee", padding: 72, fontFamily: font ? "Fraunces" : "serif" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, letterSpacing: 6, opacity: 0.85 }}>
          <span>BIOMA | EVIDENCE</span>
          <span>UBERLÂNDIA · MG</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 132, lineHeight: 0.92, letterSpacing: -4 }}>
          <span>Beleza natural</span>
          <span style={{ paddingLeft: 220 }}>como rotina<span style={{ color: "#e0a83a" }}>.</span></span>
        </div>
        <div style={{ display: "flex", fontSize: 26, color: "#efe6d6" }}>Saúde capilar · Visagismo · Bem-estar · Sustentabilidade</div>
      </div>
    ),
    { ...size, fonts: font ? [{ name: "Fraunces", data: font, weight: 300, style: "normal" }] : undefined },
  );
}
