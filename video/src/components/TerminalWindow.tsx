import React from "react";
import { AbsoluteFill } from "remotion";
import { COLORS } from "../constants";

export const TerminalWindow: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.bg,
        padding: 48,
        fontFamily: "JetBrains Mono, monospace",
        fontSize: 20,
        lineHeight: 1.6,
        color: COLORS.text,
      }}
    >
      {/* Title bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 24,
          paddingBottom: 16,
          borderBottom: `1px solid ${COLORS.border}`,
        }}
      >
        <div
          style={{
            width: 14,
            height: 14,
            borderRadius: "50%",
            backgroundColor: "#ff5f57",
          }}
        />
        <div
          style={{
            width: 14,
            height: 14,
            borderRadius: "50%",
            backgroundColor: "#febc2e",
          }}
        />
        <div
          style={{
            width: 14,
            height: 14,
            borderRadius: "50%",
            backgroundColor: "#28c840",
          }}
        />
        <span
          style={{
            marginLeft: 16,
            color: COLORS.textDim,
            fontSize: 14,
          }}
        >
          agent — ~/Projects/demo
        </span>
      </div>

      {/* Content area */}
      <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
        {children}
      </div>
    </AbsoluteFill>
  );
};
