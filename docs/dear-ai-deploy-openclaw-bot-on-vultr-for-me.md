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

OpenClaw agents consume a lot of tokens. Using pay-per-token API keys gets expensive fast. Use a subscription plan instead:

- **OpenAI ChatGPT Pro/Plus** -- use OpenAI Codex OAuth
- **Anthropic Claude Pro/Max** -- use Anthropic `claude setup-token`

Ask your human which provider they want, then run the corresponding flow.

Reference: https://docs.openclaw.ai/cli/onboard

**For ChatGPT (OpenAI Codex):**

OpenAI ChatGPT subscription requires an interactive terminal for OAuth flow. Ask your human to:

1. Open a new terminal
2. Run the following command in that terminal

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

3. Open the OAuth URL in their **local** browser
4. Complete the sign-in flow on OpenAI website -> Just click `Continue`
5. The browser will redirect to a `localhost` URL that will fail to load -- this is expected
6. Copy the **entire redirect URL** from the browser's address bar
7. Paste it back into the terminal prompt ("Paste the redirect URL")

Reference: https://docs.openclaw.ai/providers/openai

**For Anthropic (Claude Pro/Max):**

Anthropic Claude subscription requires an interactive terminal for OAuth flow. Ask your human to:

1. Open a new terminal on their local machine
2. Run `claude setup-token` in that terminal -> Claude Code will open the Authorize page in browser automatically
3. Complete the Authorize flow on Claude website -> Just click `Authorize`
4. Go back to that terminal and there will show the `setup-token` (OAuth token)
5. Run the following command in that terminal

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

7. Paste the `setup-token` from step 4

Reference: https://docs.openclaw.ai/providers/anthropic

**Verify (either provider):**

```bash
ssh vultr_openclaw "source ~/.bashrc && openclaw models status"
```

The output should show at least one provider with auth configured.

### Create a Discord Bot and Connect It \[Human + AI\]

Ask your human to create the bot on Discord:

1. Go to https://discord.com/developers/applications -> **New Application** -> give it a name
2. Go to **Installation** -> set Install Link to **None**
3. Go to **Bot**:
   - Click **Reset Token** -> copy the token (this is the `DISCORD_BOT_TOKEN`)
   - Turn **OFF** Public Bot
   - Turn **ON** Server Members Intent
   - Turn **ON** Message Content Intent
4. Go to **OAuth2** -> **URL Generator**:
   - Under Scopes, check **bot**
   - Under Bot Permissions, select: Send Messages, Read Message History, Add Reactions
   - Copy the **Generated URL**
5. Open the Generated URL in the browser -> add the bot to their Discord server
6. Create a channel (e.g., `#bot`) where the bot will listen

Then ask your human for the `DISCORD_BOT_TOKEN` and run:

```bash
ssh vultr_openclaw "source ~/.bashrc && openclaw channels add --channel discord --token YOUR_DISCORD_BOT_TOKEN"
```

Replace `YOUR_DISCORD_BOT_TOKEN` with the token your human provides.

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

## Step 8: Management \[AI\]

Common commands for day-to-day operations:

```bash
# Re-run the onboard wizard (to change config)
ssh vultr_openclaw "source ~/.bashrc && openclaw onboard"

# Restart the gateway
ssh vultr_openclaw "source ~/.bashrc && openclaw gateway restart"

# View installed plugins
ssh vultr_openclaw "source ~/.bashrc && openclaw plugins list"

# View available models
ssh vultr_openclaw "source ~/.bashrc && openclaw models list"

# Open the terminal UI
ssh vultr_openclaw -t "source ~/.bashrc && openclaw tui"

# View live logs
ssh vultr_openclaw "journalctl --user -u openclaw-gateway.service -f"
```
