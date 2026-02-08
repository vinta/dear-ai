import React from "react";
import { interpolate, useCurrentFrame } from "remotion";

export const Cursor: React.FC<{
  color?: string;
}> = ({ color = "#e0e0e0" }) => {
  const frame = useCurrentFrame();
  const blinkFrames = 16;
  const opacity = interpolate(
    frame % blinkFrames,
    [0, blinkFrames / 2, blinkFrames],
    [1, 0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <span style={{ opacity, color, fontWeight: "bold" }}>{"\u258C"}</span>
  );
};
