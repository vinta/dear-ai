# Dear AI, Deploy OpenClaw Bot for Me

Each step is marked:

- **[Human]** -- Human acts (web UI, copying tokens)
- **[AI]** -- AI executes (SSH commands, file edits)
- **[Human + AI]** -- Both collaborate (AI runs commands, human provides input mid-step)

## How to Use This Guide [Human]

Open Claude Code/Codex/Gemini in your terminal and type `Fetch and follow https://vinta.github.io/dear-ai/deploy-openclaw-bot-for-me.md`. Your AI should handle all the hard parts for you!

This guide only covers a minimal setup. Once the OpenClaw bot is running, you can talk to it directly in Discord to customize it however you like.

## How to Use This Guide [AI]

You are deploying an [OpenClaw](https://openclaw.ai) bot on a Vultr VPS for your human. Follow each step in order. Steps marked `[AI]` are yours to execute. Steps marked `[Human]` require your human to act -- present them the instructions and wait for their input. Steps marked `[Human + AI]` are collaborative.

Use the `AskUserQuestion` tool whenever you need your human to provide input (IP addresses, tokens, confirmations, etc.). If your human runs into issues during a `[Human]` step, ask them to paste a screenshot -- you can read images and diagnose most UI problems directly.

If you have the `context7` MCP available, use it to query OpenClaw documentation when you encounter issues during installation or when your human asks questions about OpenClaw. Use library id `/llmstxt/openclaw_ai_llms-full_txt`.

---

## Step 1: Generate an SSH Key [AI]

Generate an SSH key pair on your local machine. Skip if you already have one at `~/.ssh/vultr_openclaw`.

```bash
ssh-keygen -t ed25519 -f ~/.ssh/vultr_openclaw -N "" -C "vultr_openclaw"
```

**Verify:** File `~/.ssh/vultr_openclaw.pub` exists.

## Step 2: Add SSH Key to Vultr [Human]

1. Read `~/.ssh/vultr_openclaw.pub` and display the public key so your human can copy it
2. Ask your human to go to [Vultr SSH Keys](https://my.vultr.com/sshkeys/), click **Add SSH Key**, name it `vultr_openclaw`, paste the public key, and save

**Verify:** Ask your human to confirm the key appears at [Vultr SSH Keys](https://my.vultr.com/sshkeys/)

## Step 3: Deploy a Server on Vultr [Human]

Ask your human to create a Vultr server with these settings:

1. Go to [Vultr](https://my.vultr.com/) -> **Deploy** -> **Deploy New Server**
2. Select **Type**: **Shared CPU**
3. Select **Location**: choose a location close to them
4. Select **Plan**: the minimum is `vc2-1c-2gb` (1 vCPU, 2 GB RAM) -- lower will OOM
5. (Optional) Disable **Automatic Backups** to save cost
6. Click **Configure Software**
7. Select **OS**: Ubuntu 24.04
8. Under **SSH Keys**, select the key added in Step 2
9. Enter **Server Hostname**: `openclaw`
10. Enable **Limited User Login**
11. Click **Deploy**

Wait for the server status to show **Running**, then ask your human for the **IP address**.

## Step 4: Configure SSH Shortcut [AI]

Add this to the local `~/.ssh/config` so subsequent commands can use `ssh vultr_openclaw`:

```ssh-config
Host vultr_openclaw
    HostName YOUR_SERVER_IP
    User linuxuser
    IdentityFile ~/.ssh/vultr_openclaw
```

Replace `YOUR_SERVER_IP` with the IP from Step 3.

**Verify:**

```bash
ssh vultr_openclaw "whoami"
# Expected output: linuxuser
```

## Step 5: Install OpenClaw [AI]

SSH into the server and run the installer with `--no-onboard` to skip the interactive wizard (we'll run it separately in the next step):

```bash
ssh vultr_openclaw "curl -fsSL https://openclaw.ai/install.sh | bash -s -- --no-onboard"
```

The `linuxuser` account on a fresh Vultr VPS has no `.bashrc` or `.profile`, so `openclaw` won't be on `$PATH` -- neither for SSH commands nor for interactive login. Set up both:

```bash
ssh vultr_openclaw 'echo "export PATH=\$HOME/.npm-global/bin:\$PATH" >> ~/.bashrc'
ssh vultr_openclaw 'echo "[ -f ~/.bashrc ] && . ~/.bashrc" >> ~/.profile'
```

Reference: [OpenClaw Install](https://docs.openclaw.ai/install)

## Step 6: Configure OpenClaw with LLM Models [Human]

OpenClaw agents burn through tokens fast. A subscription plan is much cheaper than pay-per-token API keys:

- **OpenAI ChatGPT Pro/Plus** -- authenticates via Codex OAuth
- **Anthropic Claude Pro/Max** -- authenticates via `claude setup-token`

Ask your human which provider they prefer, then walk them through the corresponding flow below. Both require an interactive terminal, so your human will need to run the commands themselves.

Reference: [OpenClaw Onboard](https://docs.openclaw.ai/cli/onboard)

**For ChatGPT (OpenAI Codex):**

Ask your human to open a new terminal and run:

```bash
ssh -t vultr_openclaw "source ~/.bashrc && openclaw onboard \
   --accept-risk \
   --flow quickstart \
   --mode local \
   --gateway-port 18789 \
   --gateway-bind loopback \
   --install-daemon \
   --auth-choice openai-codex \
   --skip-channels \
   --skip-skills \
   --skip-health \
   --skip-ui"
```

The command will print an OAuth URL. Your human should:

1. Open the URL in their **local** browser
2. Sign in on the OpenAI website and click **Continue**
3. The browser will redirect to a `localhost` URL that fails to load -- this is expected
4. Copy the **entire URL** from the address bar and paste it back into the terminal prompt

Reference: [OpenClaw OpenAI Provider](https://docs.openclaw.ai/providers/openai)

**For Anthropic (Claude Pro/Max):**

This is a two-part flow. First, your human generates a setup-token locally, then pastes it into the onboard command on the server.

Ask your human to open a new terminal and run:

1. `claude setup-token` -- this opens the Anthropic authorize page in their browser
2. Click **Authorize** on the Anthropic website
3. Go back to the terminal and copy the token that was printed
4. Run the onboard command:

```bash
ssh -t vultr_openclaw "source ~/.bashrc && openclaw onboard \
   --accept-risk \
   --flow quickstart \
   --mode local \
   --gateway-port 18789 \
   --gateway-bind loopback \
   --install-daemon \
   --auth-choice setup-token \
   --skip-channels \
   --skip-skills \
   --skip-health \
   --skip-ui"
```

5. Paste the token when prompted

Reference: [OpenClaw Anthropic Provider](https://docs.openclaw.ai/providers/anthropic)

**Verify (either provider):**

```bash
ssh vultr_openclaw "source ~/.bashrc && openclaw models status"
```

Should show at least one provider with auth configured.

## Step 7: Configure OpenClaw with Discord [Human + AI]

Enable the Discord plugin first:

```bash
ssh vultr_openclaw "source ~/.bashrc && openclaw plugins enable discord"
```

Ask your human to create the bot on Discord:

1. Go to [Discord Developer Applications](https://discord.com/developers/applications) -> **New Application** -> Name it `OpenClaw`
2. Go to **Installation** -> Set Install Link to **None** -> Save Changes
3. Go to **Bot**:
   - Click **Reset Token** -> Copy the token (this is the `DISCORD_BOT_TOKEN`)
   - Turn **OFF** Public Bot
   - Turn **ON** Server Members Intent
   - Turn **ON** Message Content Intent
   - Select **Administrator** for Bot Permissions
   - Save Changes
4. Go to **OAuth2** -> **URL Generator**:
   - Under Scopes, select **bot**
   - Under Bot Permissions, select: **Administrator**
   - Copy the **Generated URL**
5. Open the Generated URL in the browser -> Add the app to their Discord server
6. Create a text channel (e.g., `#bot`) on their Discord server

Ask your human for the `DISCORD_BOT_TOKEN` and run:

```bash
ssh vultr_openclaw "source ~/.bashrc && openclaw channels add --channel discord --token YOUR_DISCORD_BOT_TOKEN"
```

Replace `YOUR_DISCORD_BOT_TOKEN` with the token your human provides.

The default `groupPolicy` is `allowlist` with no entries, so the bot silently ignores all server messages. Set it to `open` so the bot responds in any channel:

```bash
ssh vultr_openclaw "source ~/.bashrc && openclaw config set channels.discord.groupPolicy open"
ssh vultr_openclaw "source ~/.bashrc && openclaw gateway restart"
```

Reference: [OpenClaw Discord Channel](https://docs.openclaw.ai/channels/discord)

**Verify:**

```bash
ssh vultr_openclaw "test -f ~/.openclaw/openclaw.json && echo 'config exists'"
```

## Step 8: Post-Install [AI]

Install dependencies and harden the server. These are all non-interactive -- no human input needed.

### Homebrew

OpenClaw uses `brew` for skills dependency management:

```bash
ssh vultr_openclaw 'NONINTERACTIVE=1 /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"'
ssh vultr_openclaw 'echo "eval \"\$(/home/linuxbrew/.linuxbrew/bin/brew shellenv bash)\"" >> ~/.bashrc'
```

### Server Hardening

Enable automatic security updates:

```bash
ssh vultr_openclaw "sudo apt-get update && sudo apt-get install -y unattended-upgrades"
ssh vultr_openclaw "sudo dpkg-reconfigure -f noninteractive unattended-upgrades"
```

Allow only SSH inbound (the bot only makes outbound connections to Discord and LLM APIs):

```bash
ssh vultr_openclaw "sudo ufw default deny incoming && sudo ufw default allow outgoing && sudo ufw allow OpenSSH && sudo ufw --force enable"
```

**Verify:**

```bash
ssh vultr_openclaw "source ~/.bashrc && brew --version && sudo ufw status"
```

## Step 9: Verify End-to-End [Human]

Ask your human to send a message in the configured Discord channel (e.g., `#bot`). The bot should respond.

If it doesn't respond, check the logs:

```bash
ssh vultr_openclaw "journalctl --user -u openclaw-gateway.service -n 50 --no-pager"
```

## Step 10: What's Next [Human]

The bot is live. Let your human know they can now talk to it directly in Discord to customize their setup. Suggest they try:

- `@OpenClaw Can you respond without me @mentioning you every time?`
- `@OpenClaw How do I access the web UI from my local machine?`
- `@OpenClaw What should I do to harden my setup?`
- `@OpenClaw Help me set up backups for your workspace. Any suggestions?`

## Debugging [AI]

Common commands for debugging:

```bash
# Restart the gateway
ssh vultr_openclaw "source ~/.bashrc && openclaw gateway restart"

# View installed plugins
ssh vultr_openclaw "source ~/.bashrc && openclaw plugins list"

# Check auth / provider status
ssh vultr_openclaw "source ~/.bashrc && openclaw models status"

# View recent logs (last 50 lines)
ssh vultr_openclaw "journalctl --user -u openclaw-gateway.service -n 50 --no-pager"

# View full log file (more detail than journalctl)
ssh vultr_openclaw "cat /tmp/openclaw/openclaw-\$(date -u +%Y-%m-%d).log | tail -100"
```
