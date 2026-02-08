import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { TerminalWindow } from "../components/TerminalWindow";
import { COLORS } from "../constants";

const FAKE_PUB_KEY =
  "ssh-ed25519 ABCDEFabcdef123456789akePublicKeyXXXXXXXXXXXXXXXXXXXXXXXXXX/Fake vultr_openclaw";

// Timed content blocks — each appears after a delay (in seconds)
const BLOCKS: Array<{
  delay: number; // seconds from scene start
  type: "agent-text" | "bash" | "bash-output" | "read" | "read-output" | "ask-header" | "ask-body" | "ask-options" | "ask-footer";
  lines: string[];
  color?: string;
}> = [
  {
    delay: 0,
    type: "agent-text",
    lines: [
      "Got the full guide. I'm deploying an OpenClaw bot on a Vultr VPS for you.",
      "Let me work through this step by step.",
    ],
  },
  {
    delay: 1.2,
    type: "agent-text",
    lines: [
      "Step 1: Generate SSH Key -- let me check if one already exists.",
    ],
  },
  {
    delay: 2.0,
    type: "bash",
    lines: [
      'Bash(test -f ~/.ssh/vultr_openclaw.pub && echo "EXISTS" || echo "NOT_FOUND")',
    ],
  },
  {
    delay: 2.4,
    type: "bash-output",
    lines: ["  NOT_FOUND"],
  },
  {
    delay: 3.0,
    type: "bash",
    lines: [
      'Bash(ssh-keygen -t ed25519 -f ~/.ssh/vultr_openclaw -N "" -C "vultr_openclaw")',
    ],
  },
  {
    delay: 3.4,
    type: "bash-output",
    lines: [
      "  Generating public/private ed25519 key pair.",
      "  Your identification has been saved in ~/.ssh/vultr_openclaw",
      "  Your public key has been saved in ~/.ssh/vultr_openclaw.pub",
      "  The key fingerprint is:",
      "  SHA256:FakeFingerprint1234567890abcdefABCDEFghijkl vultr_openclaw",
    ],
  },
  {
    delay: 4.5,
    type: "agent-text",
    lines: ["SSH key generated. Now let me read the public key for you."],
  },
  {
    delay: 5.2,
    type: "read",
    lines: ["Read(~/.ssh/vultr_openclaw.pub)", "  Read 2 lines"],
  },
  // AskUserQuestion UI — appears at 6s, scene is 16s, so visible for ~10s
  {
    delay: 6.0,
    type: "ask-header",
    lines: ["SSH Key"],
  },
  {
    delay: 6.0,
    type: "ask-body",
    lines: [
      "Please complete these steps, then confirm:",
      "",
      "1. Copy this public key:",
      "",
      FAKE_PUB_KEY,
      "",
      "2. Go to https://my.vultr.com/sshkeys/",
      "3. Click **Add SSH Key**, name it 'vultr_openclaw', paste the key, and save",
      "",
      "Does the key appear in your Vultr SSH Keys list?",
    ],
  },
  {
    delay: 7.5,
    type: "ask-options",
    lines: [
      "1. Done",
      "   The SSH key is saved in Vultr",
      "2. Need help",
      "   Something went wrong or I have questions",
      "3. Type something.",
      "",
      "4. Chat about this",
    ],
  },
  {
    delay: 7.5,
    type: "ask-footer",
    lines: ["Enter to select · ↑/↓ to navigate · Esc to cancel"],
  },
];

const LINE_H = 26;

// Map each visual line index to its option index (0-3), or -1 for subtext/blank
const OPTION_LINE_MAP = [0, -1, 1, -1, 2, -1, 3]; // lines: "1. Done", subtext, "2. Need help", subtext, "3. Type...", blank, "4. Chat..."

// Selection keyframes: [seconds_after_options_appear, option_index]
const SELECTION_KEYFRAMES: Array<[number, number]> = [
  [0, 0],    // start on "1. Done"
  [1.5, 1],  // move to "2. Need help"
  [3.0, 2],  // move to "3. Type something"
  [5.0, 0],  // back to "1. Done"
];

const AskOptions: React.FC<{
  lines: string[];
  localFrame: number;
  fps: number;
}> = ({ lines, localFrame, fps }) => {
  // Determine current selection based on keyframes
  let selectedOption = 0;
  for (const [sec, opt] of SELECTION_KEYFRAMES) {
    if (localFrame >= Math.round(sec * fps)) {
      selectedOption = opt;
    }
  }

  return (
    <div style={{ marginTop: 4 }}>
      {lines.map((line, li) => {
        const optionIndex = OPTION_LINE_MAP[li] ?? -1;
        const isOptionLine = optionIndex >= 0;
        const isSelected = isOptionLine && optionIndex === selectedOption;
        const isSubtext = line.startsWith("   ") && !isOptionLine;
        // Subtext belongs to the option above it
        const parentOption = li > 0 ? OPTION_LINE_MAP[li - 1] ?? -1 : -1;
        const isSelectedSubtext = isSubtext && parentOption === selectedOption;

        return (
          <div
            key={li}
            style={{
              height: LINE_H,
              fontSize: isSubtext ? 15 : 17,
              color: isSelected || isSelectedSubtext
                ? COLORS.aiStep
                : isSubtext
                ? COLORS.textDim
                : COLORS.text,
              fontWeight: isSelected ? "bold" : "normal",
              whiteSpace: "pre",
              display: "flex",
              alignItems: "center",
            }}
          >
            {isOptionLine && (
              <span
                style={{
                  color: isSelected ? COLORS.aiStep : COLORS.textDim,
                  marginRight: 4,
                }}
              >
                {isSelected ? ")" : " "}
              </span>
            )}
            {line}
          </div>
        );
      })}
    </div>
  );
};

export const AgentExecution: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const viewportH = 920;

  // Auto-scroll: track how many lines are visible so far
  let visibleLines = 0;
  for (const block of BLOCKS) {
    const blockFrame = Math.round(block.delay * fps);
    if (frame >= blockFrame) {
      visibleLines += block.lines.length + 1;
    }
  }
  const contentBottom = visibleLines * LINE_H;
  const smoothScroll = Math.max(0, contentBottom - viewportH + 60);

  return (
    <TerminalWindow>
      <div
        style={{
          position: "relative",
          height: viewportH,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            transform: `translateY(${-smoothScroll}px)`,
          }}
        >
          {BLOCKS.map((block, bi) => {
            const blockFrame = Math.round(block.delay * fps);
            const localF = frame - blockFrame;
            if (localF < 0) return null;

            const fadeIn = interpolate(localF, [0, 6], [0, 1], {
              extrapolateRight: "clamp",
            });

            return (
              <div key={bi} style={{ opacity: fadeIn, marginBottom: LINE_H }}>
                {block.type === "agent-text" &&
                  block.lines.map((line, li) => (
                    <div
                      key={li}
                      style={{
                        height: LINE_H,
                        color: COLORS.text,
                        fontSize: 18,
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {li === 0 && (
                        <span
                          style={{
                            color: COLORS.aiStep,
                            marginRight: 8,
                            fontSize: 14,
                          }}
                        >
                          ●
                        </span>
                      )}
                      {line}
                    </div>
                  ))}

                {block.type === "bash" &&
                  block.lines.map((line, li) => (
                    <div
                      key={li}
                      style={{
                        height: LINE_H,
                        fontSize: 17,
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <span
                        style={{
                          color: COLORS.aiStep,
                          marginRight: 8,
                          fontSize: 14,
                        }}
                      >
                        ●
                      </span>
                      <span style={{ color: COLORS.aiStep }}>
                        {line.split("(")[0]}
                      </span>
                      <span style={{ color: COLORS.text }}>
                        ({line.split("(").slice(1).join("(")}
                      </span>
                    </div>
                  ))}

                {block.type === "bash-output" &&
                  block.lines.map((line, li) => (
                    <div
                      key={li}
                      style={{
                        height: LINE_H,
                        color: COLORS.textDim,
                        fontSize: 16,
                        whiteSpace: "pre",
                      }}
                    >
                      {line}
                    </div>
                  ))}

                {block.type === "read" &&
                  block.lines.map((line, li) => (
                    <div
                      key={li}
                      style={{
                        height: LINE_H,
                        fontSize: li === 0 ? 17 : 16,
                        display: "flex",
                        alignItems: "center",
                        whiteSpace: "pre",
                      }}
                    >
                      {li === 0 && (
                        <span
                          style={{
                            color: COLORS.aiStep,
                            marginRight: 8,
                            fontSize: 14,
                          }}
                        >
                          ●
                        </span>
                      )}
                      {li === 0 ? (
                        <>
                          <span style={{ color: COLORS.aiStep }}>Read</span>
                          <span style={{ color: COLORS.text }}>
                            {line.replace("Read", "")}
                          </span>
                        </>
                      ) : (
                        <span style={{ color: COLORS.textDim }}>{line}</span>
                      )}
                    </div>
                  ))}

                {block.type === "read-output" &&
                  block.lines.map((line, li) => (
                    <div
                      key={li}
                      style={{
                        height: LINE_H,
                        color: COLORS.textDim,
                        fontSize: 16,
                        whiteSpace: "pre",
                      }}
                    >
                      {line}
                    </div>
                  ))}

                {block.type === "agent-text" && null}

                {block.type === "ask-header" && (
                  <div
                    style={{
                      display: "inline-block",
                      border: `1px solid ${COLORS.aiStep}`,
                      borderRadius: 4,
                      padding: "2px 10px",
                      color: COLORS.aiStep,
                      fontSize: 14,
                      fontWeight: "bold",
                    }}
                  >
                    {block.lines[0]}
                  </div>
                )}

                {block.type === "ask-body" &&
                  block.lines.map((line, li) => {
                    const isPubKey = line === FAKE_PUB_KEY;
                    return (
                      <div
                        key={li}
                        style={{
                          height: LINE_H,
                          color: isPubKey ? COLORS.codeBlock : COLORS.text,
                          fontSize: isPubKey ? 15 : 17,
                          fontWeight: isPubKey ? "bold" : "normal",
                          whiteSpace: "pre",
                          backgroundColor: isPubKey
                            ? COLORS.codeBlockBg
                            : "transparent",
                          padding: isPubKey ? "2px 6px" : 0,
                          borderRadius: isPubKey ? 4 : 0,
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        {line}
                      </div>
                    );
                  })}

                {block.type === "ask-options" && (
                  <AskOptions
                    lines={block.lines}
                    localFrame={localF}
                    fps={fps}
                  />
                )}

                {block.type === "ask-footer" && (
                  <div
                    style={{
                      marginTop: 8,
                      color: COLORS.textDim,
                      fontSize: 14,
                    }}
                  >
                    {block.lines[0]}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </TerminalWindow>
  );
};
