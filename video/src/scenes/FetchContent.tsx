import React from "react";
import {
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";
import { TerminalWindow } from "../components/TerminalWindow";
import { COLORS } from "../constants";

const FETCH_URL =
  "https://vinta.github.io/dear-ai/deploy-openclaw-bot-for-me.md";

export const FetchContent: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Line 1: hook completed (appears at frame 0)
  const line1Opacity = interpolate(frame, [0, 5], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Line 2: fetch call (appears at 0.3s)
  const line2Start = Math.round(0.3 * fps);
  const line2Opacity = interpolate(frame, [line2Start, line2Start + 5], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  // Line 3: progress bar (appears at 0.8s)
  const line3Start = Math.round(0.8 * fps);
  const line3Opacity = interpolate(frame, [line3Start, line3Start + 5], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  // Progress bar animation
  const progressEnd = Math.round(2.0 * fps);
  const progress = interpolate(frame, [line3Start, progressEnd], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
    easing: Easing.out(Easing.quad),
  });
  const barWidth = Math.round(progress * 40);
  const progressBar =
    "[" + "█".repeat(barWidth) + "░".repeat(40 - barWidth) + "]";

  // Line 4: received (appears at 2.0s)
  const line4Start = Math.round(2.0 * fps);
  const line4Opacity = interpolate(frame, [line4Start, line4Start + 5], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  return (
    <TerminalWindow>
      <div>
        {/* User command (shown as already entered) */}
        <div style={{ display: "flex", gap: 0, marginBottom: 24 }}>
          <span style={{ color: COLORS.accent, marginRight: 12 }}>{">"}</span>
          <span style={{ color: COLORS.white, opacity: 0.6, wordBreak: "break-all" }}>
            Fetch and follow {FETCH_URL}
          </span>
        </div>

        {/* Hook line */}
        <div style={{ opacity: line1Opacity, color: COLORS.textDim, fontSize: 16 }}>
          Session started
        </div>

        {/* Fetch call */}
        <div
          style={{
            opacity: line2Opacity,
            marginTop: 12,
          }}
        >
          <span style={{ color: COLORS.aiStep }}>Fetch</span>
          <span style={{ color: COLORS.textDim }}>(</span>
          <span style={{ color: COLORS.text }}>url: </span>
          <span style={{ color: COLORS.codeBlock, fontSize: 17, wordBreak: "break-all" }}>
            "{FETCH_URL}"
          </span>
          <span style={{ color: COLORS.textDim }}>)</span>
        </div>

        {/* Progress bar */}
        <div
          style={{
            opacity: line3Opacity,
            marginTop: 12,
            color: COLORS.aiStep,
            fontFamily: "JetBrains Mono, monospace",
            whiteSpace: "pre",
          }}
        >
          {progressBar} {Math.round(progress * 100)}%
        </div>

        {/* Received */}
        <div
          style={{
            opacity: line4Opacity,
            marginTop: 12,
            color: COLORS.aiStep,
          }}
        >
          Received 10.2KB (200 OK)
        </div>
      </div>
    </TerminalWindow>
  );
};
