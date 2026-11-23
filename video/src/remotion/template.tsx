// The shared look of every app's video: title card, browser window, callout column, outro.
// Main (the video) and Storyboard (one still per beat) both render from here.
import { loadFont } from "@remotion/google-fonts/Inter";
import { loadFont as loadSpaceGrotesk } from "@remotion/google-fonts/SpaceGrotesk";
import { createContext, useContext, type CSSProperties, type ReactNode } from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
} from "remotion";
import type { VideoConfig } from "../types";
import type { Camera } from "./timeline";

export const { fontFamily } = loadFont("normal", {
  weights: ["400", "500", "600"],
  subsets: ["latin"],
});
// ORA's wordmark (its config's titleStyle).
loadSpaceGrotesk("normal", { weights: ["700"], subsets: ["latin"] });

// Desktop (1920x1080): browser frame on the right, callout column on the left.
const FRAME_Y = (1080 - 792 - 44) / 2;
export const DESKTOP = {
  width: 1920,
  height: 1080,
  frame: { x: 424, y: FRAME_Y, width: 1408, bar: 44 },
  /** Screen aspect of the browser frame; the camera reframes the 16:9 capture to it. */
  aspect: 16 / 9,
  callout: { x: 96, y: FRAME_Y + 120, width: 424 - 96 - 60, scale: 1 },
  pad: 160,
};
// Mobile (1080x1920, 9:16): callout on top, a square browser frame below it, type sized for a phone.
export const MOBILE: typeof DESKTOP = {
  width: 1080,
  height: 1920,
  frame: { x: 40, y: 1920 - 44 - 1000 - 200, width: 1000, bar: 44 },
  aspect: 1,
  callout: { x: 72, y: 96, width: 936, scale: 2.1 },
  pad: 80,
};
/** Apps recorded at a phone viewport (`device: "phone"`) sit in this handset on the mobile layout. */
export const PHONE = { width: 720, bezel: 20, radius: 76, bottom: 72 };
export const Layout = createContext(DESKTOP);

/** 0 -> 1 spring starting at `from`. */
export function useEnter(from: number, fps: number, damping = 200) {
  const frame = useCurrentFrame();
  return spring({ frame: frame - from, fps, config: { damping } });
}

function Rise({
  at,
  fps,
  children,
  style,
}: {
  at: number;
  fps: number;
  children: ReactNode;
  style?: CSSProperties;
}) {
  const p = useEnter(at, fps);
  return (
    <div
      style={{
        ...style,
        opacity: p,
        transform: `translateY(${(1 - p) * 16}px)`,
      }}
    >
      {children}
    </div>
  );
}

export function Fade({
  frames,
  out = 10,
  children,
}: {
  frames: number;
  out?: number;
  children: ReactNode;
}) {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [frames - out, frames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
}

export function TitleCard({ c }: { c: VideoConfig }) {
  const { pad } = useContext(Layout);
  return (
    <AbsoluteFill
      style={{ justifyContent: "center", paddingLeft: pad, paddingRight: pad }}
    >
      <Rise at={4} fps={c.fps}>
        {c.logo ? (
          <Img
            src={staticFile(c.logo)}
            style={{
              height: c.logoHeight ?? 168,
              display: "block",
              marginBottom: 64,
            }}
          />
        ) : (
          <div
            style={{
              width: 56,
              height: 4,
              background: c.colors.accent,
              marginBottom: 36,
            }}
          />
        )}
      </Rise>
      <Rise
        at={8}
        fps={c.fps}
        style={{
          fontSize: 104,
          fontWeight: 600,
          letterSpacing: "-0.03em",
          lineHeight: 1.02,
          ...c.titleStyle,
        }}
      >
        {c.title}
      </Rise>
      <Rise
        at={14}
        fps={c.fps}
        style={{
          fontSize: 36,
          color: c.colors.muted,
          marginTop: 28,
          maxWidth: 1100,
          textWrap: "balance", // no single orphaned word on the last line
        }}
      >
        {c.description}
      </Rise>
    </AbsoluteFill>
  );
}

export function NoticeCard({ c }: { c: VideoConfig }) {
  const { pad } = useContext(Layout);
  return (
    <AbsoluteFill
      style={{ justifyContent: "center", paddingLeft: pad, paddingRight: pad }}
    >
      <Rise at={2} fps={c.fps}>
        <div style={{ width: 56, height: 4, background: c.colors.accent, marginBottom: 36 }} />
      </Rise>
      <Rise
        at={6}
        fps={c.fps}
        style={{ fontSize: 56, fontWeight: 500, letterSpacing: "-0.02em", lineHeight: 1.2, maxWidth: 1600 }}
      >
        {c.notice?.text}
      </Rise>
    </AbsoluteFill>
  );
}

export function Outro({ c }: { c: VideoConfig }) {
  const { pad } = useContext(Layout);
  return (
    <AbsoluteFill style={{ justifyContent: "center", paddingLeft: pad, paddingRight: pad }}>
      <Rise
        at={4}
        fps={c.fps}
        style={{ fontSize: 80, fontWeight: 600, letterSpacing: "-0.03em" }}
      >
        {c.title}
      </Rise>
      <Rise
        at={9}
        fps={c.fps}
        style={{ fontSize: 32, color: c.colors.muted, marginTop: 18 }}
      >
        {c.role}
      </Rise>
      <Rise
        at={14}
        fps={c.fps}
        style={{ display: "flex", flexWrap: "wrap", gap: 14, marginTop: 44 }}
      >
        {c.tags.map((t) => (
          <div
            key={t}
            style={{
              fontSize: 24,
              fontWeight: 500,
              color: c.colors.accent,
              border: `1.5px solid ${c.colors.accent}`,
              borderRadius: 999,
              padding: "10px 22px",
            }}
          >
            {t}
          </div>
        ))}
      </Rise>
    </AbsoluteFill>
  );
}

export function Callout({
  c,
  index,
  label,
  text,
  frames,
}: {
  c: VideoConfig;
  index: number;
  label: string;
  text: string;
  frames: number;
}) {
  const frame = useCurrentFrame();
  const { callout: col } = useContext(Layout);
  const z = col.scale;
  const p = useEnter(0, c.fps);
  const out = interpolate(frame, [frames - 10, frames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        left: col.x,
        width: col.width,
        top: col.y,
        opacity: p * out,
        transform: `translateY(${(1 - p) * 16 - (1 - out) * 8}px)`,
      }}
    >
      <div
        style={{
          fontSize: 18 * z,
          fontWeight: 600,
          color: c.colors.accent,
          letterSpacing: "0.12em",
        }}
      >
        {String(index + 1).padStart(2, "0")}
      </div>
      <div
        style={{
          width: 32 * z,
          height: 3 * z,
          background: c.colors.accent,
          margin: `${16 * z}px 0 ${22 * z}px`,
        }}
      />
      <div
        style={{
          fontSize: 40 * z,
          fontWeight: 600,
          letterSpacing: "-0.02em",
          lineHeight: 1.1,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 23 * z,
          color: c.colors.muted,
          marginTop: 16 * z,
          lineHeight: 1.4,
        }}
      >
        {text}
      </div>
    </div>
  );
}

/** Browser window (or, with no `url`, a plain stage) showing `children` (laid out at the capture viewport size) through the camera. */
export function BrowserFrame({
  c,
  url,
  cam,
  enter,
  children,
  aspect,
}: {
  c: VideoConfig;
  url: string;
  cam: Camera;
  enter: number;
  children: ReactNode;
  /** Screen aspect; defaults to the layout's (scenes keep their own 16:9). */
  aspect?: number;
}) {
  const { width: W, height: H } = c.capture.viewport;
  const L = useContext(Layout);
  const FRAME = L.frame;
  const SCREEN_H = FRAME.width / (aspect ?? L.aspect);
  const top = FRAME.y + (FRAME.width / L.aspect - SCREEN_H) / 2; // a shorter screen sits centered in the layout's slot
  const rise = {
    opacity: enter,
    transform: `translateY(${(1 - enter) * 40}px) scale(${0.98 + 0.02 * enter})`,
  };
  if (c.device === "phone") {
    const sw = PHONE.width - 2 * PHONE.bezel;
    const sh = (sw * H) / W;
    return (
      <div
        style={{
          position: "absolute",
          left: (L.width - PHONE.width) / 2,
          top: L.height - PHONE.bottom - sh - 2 * PHONE.bezel,
          padding: PHONE.bezel,
          borderRadius: PHONE.radius,
          background: "#16181A",
          boxShadow:
            "0 40px 90px rgba(20,32,26,0.22), 0 6px 18px rgba(20,32,26,0.08), inset 0 0 0 2px #3A3D40",
          ...rise,
        }}
      >
        <div
          style={{
            width: sw,
            height: sh,
            overflow: "hidden",
            position: "relative",
            borderRadius: PHONE.radius - PHONE.bezel,
            background: c.colors.surface,
          }}
        >
          <div
            style={{
              width: W,
              height: H,
              transformOrigin: "0 0",
              transform: `scale(${sw / W}) translate(${cam.tx}px, ${cam.ty}px) scale(${cam.k})`,
            }}
          >
            {children}
          </div>
        </div>
      </div>
    );
  }
  return (
    <div
      style={{
        position: "absolute",
        left: FRAME.x,
        top: url ? top : top + FRAME.bar / 2,
        width: FRAME.width,
        borderRadius: 14,
        overflow: "hidden",
        background: c.colors.surface,
        boxShadow:
          "0 40px 90px rgba(20,32,26,0.14), 0 6px 18px rgba(20,32,26,0.06)",
        outline: "1px solid rgba(20,32,26,0.07)",
        ...rise,
      }}
    >
      {url && (
        <div
          style={{
            height: FRAME.bar,
            display: "flex",
            alignItems: "center",
            padding: "0 18px",
            gap: 8,
          }}
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: 12,
                height: 12,
                borderRadius: 6,
                background: "#E3E0D9",
              }}
            />
          ))}
          <div
            style={{
              margin: "0 auto",
              width: Math.min(560, FRAME.width - 300),
              height: 28,
              borderRadius: 8,
              background: c.colors.background,
              color: c.colors.muted,
              fontSize: 15,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {url}
          </div>
          <div style={{ width: 52 }} />
        </div>
      )}
      <div
        style={{
          width: FRAME.width,
          height: SCREEN_H,
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div
          style={{
            width: W,
            height: H,
            transformOrigin: "0 0",
            transform: `scale(${FRAME.width / W}) translate(${cam.tx}px, ${cam.ty}px) scale(${cam.k})`,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
