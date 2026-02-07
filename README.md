# Dear AI

> Dear AI, do that for me.

Step-by-step guides that AI coding agents can execute for you.

Open [Claude Code](https://code.claude.com/docs), [Codex](https://github.com/openai/codex), or [Gemini CLI](https://github.com/google-gemini/gemini-cli) in your terminal, point it at a guide listed below, and it handles the server setup, installation, and configuration. You handle the parts that need a browser -- creating accounts, clicking OAuth buttons, copying tokens.

## Guides

Open your AI coding agent in the terminal and type:

- `Fetch and follow https://vinta.github.io/dear-ai/deploy-openclaw-bot-for-me.md`
  - Source: [Deploy OpenClaw Bot for Me](docs/deploy-openclaw-bot-for-me.md) - Deploy an [OpenClaw](https://openclaw.ai) bot for Discord on a Vultr server

## Skills

Yes, you _could_ just use a one-line prompt like `Fetch and follow https://vinta.github.io/dear-ai/guide-name.md` and get things done. But if you _really_ need everything wrapped in a shiny agentic skill so you can pretend it's more productive, fine, knock yourself out:

```bash
npx skills add vinta/dear-ai
```
