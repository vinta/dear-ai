# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Repo Is

A collection of markdown guides designed for AI agents to execute. Each guide walks an AI (Claude Code, Codex, Gemini) through a task end-to-end, with the human only handling steps that require a browser, web UI, or manual auth.

The user's workflow: open their AI CLI, say "read this guide and do X for me", and the AI follows the guide.

There is no code to build, lint, or test. The repo is pure documentation.

## Guide Conventions

Every guide uses a dual-audience structure:

- **Before the `---`**: addresses the human ("you" = human). Brief intro on how to use the guide with their AI.
- **After the `---`**: addresses the AI ("you" = AI, "your human" = the human operator).

Steps are tagged:

- `[AI]` -- the AI executes directly (shell commands, SSH, file edits)
- `[Human]` -- the AI presents instructions and waits for the human to act (web UIs, copying tokens)
- `[Human + AI]` -- collaborative; the AI runs commands but needs human input mid-step (e.g., OAuth URLs, bot tokens)

Design principles:

- **Verification after every step.** Each step ends with a check to confirm it succeeded before the AI moves on.
- **Non-interactive over interactive.** Prefer CLI flags (`--non-interactive`, `--token X`) over TUI wizards so the AI can execute via SSH without a TTY. When interactive is unavoidable (OAuth flows), mark the step `[Human]` and have the human run the command with `ssh -t`.
- **Minimal scope.** Each guide covers one specific deployment/task. No kitchen-sink guides.
- **"Ask your human to..."** is the standard phrasing when the AI needs the human to do something.
- **Use `AskUserQuestion` tool** when the AI needs human input (IP addresses, tokens, provider choices).

## Repo Structure

- `README.md` -- index of all guides
- `docs/` -- individual guide files, named `dear-ai-<task-slug>.md`
