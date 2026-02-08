import React from "react";
import {
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";
import { TerminalWindow } from "../components/TerminalWindow";
import { COLORS, GUIDE_LINES } from "../constants";

const LINE_HEIGHT = 32;

export const GuideScroll: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Total content height
  const totalContentHeight = GUIDE_LINES.length * LINE_HEIGHT;
  // Visible area height (approx)
  const visibleHeight = 900;
  // Max scroll needed
  const maxScroll = Math.max(0, totalContentHeight - visibleHeight + 100);

  // Scroll starts after 0.5s pause, ends 1s before scene ends
  const scrollStart = Math.round(0.5 * fps);
  const scrollEnd = durationInFrames - Math.round(1 * fps);

  const scrollY = interpolate(frame, [scrollStart, scrollEnd], [0, maxScroll], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

  // Lines become visible as they scroll into view
  const getLineOpacity = (lineIndex: number) => {
    const lineY = lineIndex * LINE_HEIGHT;
    const screenY = lineY - scrollY;
    // Fade in when entering viewport from bottom
    if (screenY > visibleHeight - 50) {
      return interpolate(screenY, [visibleHeight - 50, visibleHeight], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
    }
    // Fade out when exiting viewport from top
    if (screenY < 20) {
      return interpolate(screenY, [-20, 20], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
    }
    return 1;
  };

  // Fade in the whole scene
  const sceneFade = interpolate(frame, [0, 10], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <TerminalWindow>
      <div style={{ opacity: sceneFade }}>
        {/* Header bar */}
        <div
          style={{
            fontSize: 14,
            color: COLORS.textDim,
            marginBottom: 16,
            paddingBottom: 8,
            borderBottom: `1px solid ${COLORS.border}`,
          }}
        >
          Reading: deploy-openclaw-bot-for-me.md
        </div>

        {/* Scrolling content */}
        <div
          style={{
            position: "relative",
            height: visibleHeight,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              transform: `translateY(${-scrollY}px)`,
            }}
          >
            {GUIDE_LINES.map((line, i) => {
              const isHeader =
                line.text.startsWith("# ") || line.text.startsWith("## ");
              const isCode =
                line.color === COLORS.codeBlock;

              return (
                <div
                  key={i}
                  style={{
                    height: LINE_HEIGHT,
                    display: "flex",
                    alignItems: "center",
                    opacity: getLineOpacity(i),
                    whiteSpace: "pre",
                    backgroundColor: isCode
                      ? COLORS.codeBlockBg
                      : "transparent",
                  }}
                >
                  {line.blank ? null : (
                    <span
                      style={{
                        color: line.color || COLORS.text,
                        fontSize: isHeader ? 24 : isCode ? 18 : 20,
                        fontWeight: isHeader ? "bold" : "normal",
                      }}
                    >
                      {line.text}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </TerminalWindow>
  );
};
