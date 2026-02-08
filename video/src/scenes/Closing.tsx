import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  spring,
  Easing,
} from "remotion";
import { COLORS } from "../constants";

export const Closing: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // URL entrance with spring
  const urlScale = spring({
    frame,
    fps,
    config: { damping: 200 },
    delay: Math.round(0.3 * fps),
  });

  // Tagline fade in
  const taglineOpacity = interpolate(
    frame,
    [1 * fps, 1.5 * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const taglineY = interpolate(
    frame,
    [1 * fps, 1.5 * fps],
    [20, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.quad),
    }
  );

  // Fade out at end
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 1 * fps, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.bg,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "JetBrains Mono, monospace",
        opacity: fadeOut,
      }}
    >
      {/* Repo URL */}
      <div
        style={{
          fontSize: 48,
          color: COLORS.white,
          fontWeight: "bold",
          transform: `scale(${urlScale})`,
          marginBottom: 32,
        }}
      >
        github.com/vinta/dear-ai
      </div>

      {/* Tagline */}
      <div
        style={{
          fontSize: 32,
          color: COLORS.accent,
          opacity: taglineOpacity,
          transform: `translateY(${taglineY}px)`,
        }}
      >
        Tell your AI. Get it done.
      </div>

      {/* Subtle hint */}
      <div
        style={{
          fontSize: 18,
          color: COLORS.textDim,
          marginTop: 48,
          opacity: taglineOpacity,
          transform: `translateY(${taglineY}px)`,
        }}
      >
        Step-by-step guides that AI agents actually follow
      </div>
    </AbsoluteFill>
  );
};
