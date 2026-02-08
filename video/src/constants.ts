export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

// Scene durations in frames
export const SCENE_1_DURATION = 60; // 2s - Welcome screen
export const SCENE_2_DURATION = 75; // 2.5s - User typing
export const SCENE_3_DURATION = 90; // 3s - Fetch content
export const SCENE_4_DURATION = 150; // 5s - Guide scroll
export const SCENE_4B_DURATION = 480; // 16s - Agent execution (SSH + AskUser)
export const SCENE_5_DURATION = 90; // 3s - Closing

export const TRANSITION_DURATION = 10;

export const TOTAL_DURATION =
  SCENE_1_DURATION +
  SCENE_2_DURATION +
  SCENE_3_DURATION +
  SCENE_4_DURATION +
  SCENE_4B_DURATION +
  SCENE_5_DURATION -
  TRANSITION_DURATION * 5; // 5 transitions between 6 scenes

// Colors
export const COLORS = {
  bg: "#1a1a2e",
  text: "#e0e0e0",
  textDim: "#888888",
  userInputBar: "#2563eb",
  aiStep: "#4ade80",
  humanStep: "#fbbf24",
  codeBlock: "#22d3ee",
  codeBlockBg: "#0d1117",
  accent: "#f43f5e",
  border: "#333333",
  white: "#ffffff",
} as const;

// The command the user types
export const USER_COMMAND =
  "Fetch and follow https://vinta.github.io/dear-ai/deploy-openclaw-bot-for-me.md";

// Guide content lines for Scene 4 - rendered as terminal output
export const GUIDE_LINES: Array<{
  text: string;
  color?: string;
  indent?: number;
  blank?: boolean;
}> = [
  { text: "# Dear AI, Deploy OpenClaw Bot for Me", color: COLORS.white },
  { text: "", blank: true },
  { text: "Each step is marked:", color: COLORS.text },
  { text: "", blank: true },
  {
    text: "  [Human]      -- Human acts (web UI, copying tokens)",
    color: COLORS.humanStep,
  },
  {
    text: "  [AI]         -- AI executes (SSH commands, file edits)",
    color: COLORS.aiStep,
  },
  {
    text: "  [Human + AI] -- Both collaborate",
    color: COLORS.humanStep,
  },
  { text: "", blank: true },
  {
    text: "## How to Use This Guide [Human]",
    color: COLORS.humanStep,
  },
  { text: "", blank: true },
  {
    text: 'Open your coding agent in the terminal and type "Fetch and follow',
    color: COLORS.text,
  },
  {
    text: "https://vinta.github.io/dear-ai/deploy-openclaw-bot-for-me.md\".",
    color: COLORS.text,
  },
  {
    text: "Your AI should handle all the hard parts for you!",
    color: COLORS.text,
  },
  { text: "", blank: true },
  {
    text: "## Step 1: Generate an SSH Key [AI]",
    color: COLORS.aiStep,
  },
  { text: "", blank: true },
  {
    text: "Generate an SSH key pair on your local machine.",
    color: COLORS.text,
  },
  { text: "", blank: true },
  {
    text: '  $ ssh-keygen -t ed25519 -f ~/.ssh/vultr_openclaw -N "" -C "vultr_openclaw"',
    color: COLORS.codeBlock,
  },
  { text: "", blank: true },
  {
    text: "Verify: File ~/.ssh/vultr_openclaw.pub exists.",
    color: COLORS.textDim,
  },
  { text: "", blank: true },
  {
    text: "## Step 2: Add SSH Key to Vultr [Human]",
    color: COLORS.humanStep,
  },
  { text: "", blank: true },
  {
    text: "1. Read ~/.ssh/vultr_openclaw.pub and display the public key",
    color: COLORS.text,
  },
  {
    text: "2. Ask your human to go to Vultr SSH Keys, paste the key",
    color: COLORS.text,
  },
  { text: "", blank: true },
  {
    text: "## Step 3: Deploy a Server on Vultr [Human]",
    color: COLORS.humanStep,
  },
  { text: "", blank: true },
  {
    text: "Ask your human to create a Vultr server:",
    color: COLORS.text,
  },
  {
    text: "  - Type: Shared CPU",
    color: COLORS.text,
  },
  {
    text: "  - Plan: vc2-1c-2gb (1 vCPU, 2 GB RAM)",
    color: COLORS.text,
  },
  {
    text: "  - OS: Ubuntu 24.04",
    color: COLORS.text,
  },
  {
    text: "  - SSH Key: select the key from Step 2",
    color: COLORS.text,
  },
  { text: "", blank: true },
  {
    text: "## Step 4: Configure SSH Shortcut [AI]",
    color: COLORS.aiStep,
  },
  { text: "", blank: true },
  {
    text: "Add to ~/.ssh/config:",
    color: COLORS.text,
  },
  { text: "", blank: true },
  {
    text: "  Host vultr_openclaw",
    color: COLORS.codeBlock,
  },
  {
    text: "      HostName YOUR_SERVER_IP",
    color: COLORS.codeBlock,
  },
  {
    text: "      User linuxuser",
    color: COLORS.codeBlock,
  },
  {
    text: "      IdentityFile ~/.ssh/vultr_openclaw",
    color: COLORS.codeBlock,
  },
  { text: "", blank: true },
  {
    text: "## Step 5: Install OpenClaw [AI]",
    color: COLORS.aiStep,
  },
  { text: "", blank: true },
  {
    text: '  $ ssh vultr_openclaw "curl -fsSL https://openclaw.ai/install.sh | bash"',
    color: COLORS.codeBlock,
  },
  { text: "", blank: true },
  {
    text: "## Step 6: Configure OpenClaw with LLM Models [Human]",
    color: COLORS.humanStep,
  },
  { text: "", blank: true },
  {
    text: "Ask your human which provider they prefer:",
    color: COLORS.text,
  },
  {
    text: "  - OpenAI ChatGPT Pro/Plus (OAuth)",
    color: COLORS.text,
  },
  {
    text: "  - Anthropic Claude Pro/Max (setup-token)",
    color: COLORS.text,
  },
  { text: "", blank: true },
  {
    text: "## Step 7: Configure OpenClaw with Discord [Human + AI]",
    color: COLORS.humanStep,
  },
  { text: "", blank: true },
  {
    text: "Enable the Discord plugin:",
    color: COLORS.text,
  },
  { text: "", blank: true },
  {
    text: '  $ openclaw plugins enable discord',
    color: COLORS.codeBlock,
  },
  { text: "", blank: true },
  {
    text: "Ask your human to create the bot on Discord:",
    color: COLORS.text,
  },
  {
    text: "  1. Go to Discord Developer Applications",
    color: COLORS.text,
  },
  {
    text: '  2. New Application -> Name it "OpenClaw"',
    color: COLORS.text,
  },
  {
    text: "  3. Bot -> Reset Token -> Copy the token",
    color: COLORS.text,
  },
  {
    text: "  4. Turn ON: Server Members Intent, Message Content Intent",
    color: COLORS.text,
  },
  {
    text: "  5. OAuth2 -> URL Generator -> Add bot to server",
    color: COLORS.text,
  },
  { text: "", blank: true },
  {
    text: "## Step 8: Post-Install [AI]",
    color: COLORS.aiStep,
  },
  { text: "", blank: true },
  {
    text: "Install Homebrew and harden the server:",
    color: COLORS.text,
  },
  { text: "", blank: true },
  {
    text: "  $ sudo ufw default deny incoming",
    color: COLORS.codeBlock,
  },
  {
    text: "  $ sudo ufw allow OpenSSH",
    color: COLORS.codeBlock,
  },
  {
    text: "  $ sudo ufw --force enable",
    color: COLORS.codeBlock,
  },
  { text: "", blank: true },
  {
    text: "## Step 9: Verify End-to-End [Human]",
    color: COLORS.humanStep,
  },
  { text: "", blank: true },
  {
    text: "Ask your human to send a message in the Discord channel.",
    color: COLORS.text,
  },
  {
    text: "The bot should respond.",
    color: COLORS.text,
  },
  { text: "", blank: true },
  {
    text: "## Step 10: What's Next [Human]",
    color: COLORS.humanStep,
  },
  { text: "", blank: true },
  {
    text: "The bot is live! Suggest they try:",
    color: COLORS.text,
  },
  { text: "", blank: true },
  {
    text: "  @OpenClaw Can you respond without me @mentioning you?",
    color: COLORS.accent,
  },
  {
    text: "  @OpenClaw How do I access the web UI?",
    color: COLORS.accent,
  },
  {
    text: "  @OpenClaw Help me set up backups for your workspace.",
    color: COLORS.accent,
  },
];
