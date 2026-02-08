import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { TerminalWindow } from "../components/TerminalWindow";
import { Cursor } from "../components/Cursor";
import { COLORS, USER_COMMAND } from "../constants";

const CHARS_PER_FRAME = 2.5;

export const UserTyping: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Start typing after a short pause
  const typingStart = Math.round(0.3 * fps);
  const typingFrame = Math.max(0, frame - typingStart);
  const charsTyped = Math.min(
    USER_COMMAND.length,
    Math.floor(typingFrame * CHARS_PER_FRAME)
  );
  const typedText = USER_COMMAND.slice(0, charsTyped);
  const isDoneTyping = charsTyped >= USER_COMMAND.length;

  return (
    <TerminalWindow>
      {/* Previous welcome screen faded out, just show the prompt */}
      <div style={{ marginTop: 16 }}>
        {/* Prompt indicator */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 0,
          }}
        >
          <span style={{ color: COLORS.accent, marginRight: 12 }}>{">"}</span>
          <div
            style={{
              flex: 1,
              padding: "4px 8px",
              backgroundColor: isDoneTyping
                ? COLORS.userInputBar + "33"
                : "transparent",
              borderRadius: 4,
              minHeight: 28,
              wordBreak: "break-all",
            }}
          >
            <span style={{ color: COLORS.white }}>{typedText}</span>
            {!isDoneTyping && <Cursor color={COLORS.white} />}
          </div>
        </div>

        {/* Show a subtle "press Enter" hint after typing completes */}
        {isDoneTyping && (
          <div
            style={{
              marginTop: 24,
              color: COLORS.textDim,
              fontSize: 14,
            }}
          >
            <Cursor color={COLORS.white} />
          </div>
        )}
      </div>
    </TerminalWindow>
  );
};
