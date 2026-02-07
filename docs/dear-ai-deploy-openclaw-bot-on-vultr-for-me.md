# Dear AI, Deploy OpenClaw Bot on Vultr for Me

## How to Use This Guide \[Human\]

Open Claude Code/Codex/Gemini in your terminal and type `Read https://url-to-this-post and deploy the OpenClaw bot on Vultr for me`. Your AI should handle all the hard parts for you!

Each step is marked:

- **\[Human\]** -- You need to do this yourself (web UI, copying tokens, etc.)
- **\[AI\]** -- Your AI assistant can execute this via SSH

## How to Use This Guide \[AI\]

You are deploying an [OpenClaw](https://openclaw.ai) bot on a Vultr VPS for your human. Follow each step in order. Steps marked `[AI]` are yours to execute. Steps marked `[Human]` require your human to act -- present them the instructions and wait for their input. Steps marked `[Human + AI]` are collaborative.

Use the `AskUserQuestion` tool whenever you need your human to provide input (IP addresses, tokens, confirmations, etc.).

If you have the `context7` MCP available, use it to query OpenClaw documentation when you encounter issues during installation or when your human asks questions about OpenClaw. Use libarary id `/llmstxt/openclaw_ai_llms-full_txt`.

---

## Step 1: Generate an SSH Key \[AI\]

Generate an SSH key pair on your local machine. Skip if you already have one at `~/.ssh/vultr_openclaw`.

```bash
ssh-keygen -t ed25519 -f ~/.ssh/vultr_openclaw -N "" -C "vultr_openclaw"
```

**Verify:** File `~/.ssh/vultr_openclaw.pub` exists.

## Step 2: Add SSH Key to Vultr \[Human\]

1. Print the public key: `cat ~/.ssh/vultr_openclaw.pub`
2. Ask your human to copy the output, go to https://my.vultr.com/sshkeys/, click **Add SSH Key**, name it `vultr_openclaw`, paste the public key, and save

**Verify:** Ask your human to confirm the key appears at https://my.vultr.com/sshkeys/

## Step 3: Create a Server on Vultr \[Human\]

Ask your human to create a Vultr server with these settings:

1. Go to https://my.vultr.com/ -> **Deploy** -> **Deploy New Server**
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

## Step 4: Configure SSH Shortcut \[AI\]

Add this to the local `~/.ssh/config` so subsequent commands can use `ssh vultr_openclaw`:

```
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

## Step 5: Install OpenClaw \[AI\]

SSH into the server and run the installer with `--no-onboard` to skip the interactive wizard (we'll run it separately in the next step):

```bash
ssh vultr_openclaw "curl -fsSL https://openclaw.ai/install.sh | bash -s -- --no-onboard"
```

The `linuxuser` account on a fresh Vultr VPS has no `.bashrc` or `.profile`, so `openclaw` won't be on `$PATH` -- neither for SSH commands nor for interactive login. Set up both:

```bash
ssh vultr_openclaw 'echo "export PATH=\$HOME/.npm-global/bin:\$PATH" >> ~/.bashrc'
ssh vultr_openclaw 'echo "[ -f ~/.bashrc ] && . ~/.bashrc" >> ~/.profile'
```

**Verify:**

```bash
ssh vultr_openclaw "source ~/.bashrc && openclaw --version"
```

Reference: https://docs.openclaw.ai/install

## Step 6: Onboard OpenClaw with Model Provider \[Human\]

OpenClaw agents burn through tokens fast. A subscription plan is much cheaper than pay-per-token API keys:

- **OpenAI ChatGPT Pro/Plus** -- authenticates via Codex OAuth
- **Anthropic Claude Pro/Max** -- authenticates via `claude setup-token`

Ask your human which provider they prefer, then walk them through the corresponding flow below. Both require an interactive terminal, so your human will need to run the commands themselves.

Reference: https://docs.openclaw.ai/cli/onboard

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
2. Sign in on the OpenAI website and click `Continue`
3. The browser will redirect to a `localhost` URL that fails to load -- this is expected
4. Copy the **entire URL** from the address bar and paste it back into the terminal prompt

Reference: https://docs.openclaw.ai/providers/openai

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

Reference: https://docs.openclaw.ai/providers/anthropic

**Verify (either provider):**

```bash
ssh vultr_openclaw "source ~/.bashrc && openclaw models status"
```

Should show at least one provider with auth configured.

### Create a Discord Bot and Connect It \[Human + AI\]

Enable the Discord channel plugin first:

```bash
ssh vultr_openclaw "source ~/.bashrc && openclaw plugins enable discord"
```

Ask your human to create the bot on Discord:

1. Go to https://discord.com/developers/applications -> **New Application** -> Name it `OpenClaw`
2. Go to **Installation** -> Set Install Link to **None** -> Save Changes
3. Go to **Bot**:
   - Click **Reset Token** -> Copy the token (this is the `DISCORD_BOT_TOKEN`)
   - Turn **OFF** Public Bot
   - Turn **ON** Server Members Intent
   - Turn **ON** Message Content Intent
   - Select `Administrator` for Bot Permissions
   - Save Changes
4. Go to **OAuth2** -> **URL Generator**:
   - Under Scopes, select `bot`
   - Under Bot Permissions, select: `Administrator`
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

Reference: https://docs.openclaw.ai/channels/discord

**Verify:**

```bash
ssh vultr_openclaw "test -f ~/.openclaw/openclaw.json && echo 'config exists'"
```

## Step 7: Verify End-to-End \[Human\]

Ask your human to send a message in the configured Discord channel (e.g., `#bot`). The bot should respond.

If it doesn't respond, check the logs:

```bash
ssh vultr_openclaw "journalctl --user -u openclaw-gateway.service -n 50 --no-pager"
```

## Step 8: What's Next \[Human\]

The bot is live. Let your human know they can now talk to it directly in Discord to customize their setup. Suggest they try:

- `@OpenClaw I only want you to respond in the #bot channel, not everywhere.`
- `@OpenClaw Don't reply to DMs from strangers.`
- `@OpenClaw What should I do to harden my setup?`
- `@OpenClaw Can you respond without me @mentioning you every time?`

## Debugging \[AI\]

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
