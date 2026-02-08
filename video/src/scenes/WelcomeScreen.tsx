import React from "react";
import {
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";
import { TerminalWindow } from "../components/TerminalWindow";
import { COLORS } from "../constants";

const WELCOME_LINES = [
  { text: "", blank: true },
  { text: "", blank: true },
  { text: "  Your Coding Agent", color: COLORS.white },
  { text: "", blank: true },
  { text: "  Ready to help.", color: COLORS.text },
  { text: "", blank: true },
  {
    text: "  Model:      LLM (subscription)",
    color: COLORS.textDim,
  },
  {
    text: "  Context:    ~/Projects/demo",
    color: COLORS.textDim,
  },
  { text: "", blank: true },
  {
    text: "  Tip: Use /help for a list of commands",
    color: COLORS.textDim,
  },
];

export const WelcomeScreen: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 0.5 * fps], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  return (
    <TerminalWindow>
      <div style={{ opacity: fadeIn }}>
        {WELCOME_LINES.map((line, i) => (
          <div
            key={i}
            style={{
              color: line.color || COLORS.text,
              height: line.blank ? 12 : "auto",
              fontWeight: line.color === COLORS.white ? "bold" : "normal",
              whiteSpace: "pre",
            }}
          >
            {line.blank ? "" : line.text}
          </div>
        ))}
      </div>
    </TerminalWindow>
  );
};
