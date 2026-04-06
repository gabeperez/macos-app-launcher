# macos-app-launcher

> A fast MCP server for opening, focusing, and quitting macOS apps by voice or from any MCP client.

Much faster than `macos-mcp` — uses `open -a` and `osascript` directly with no heavy runtime overhead.

---

## Tools

| Tool | What it does |
|---|---|
| `open_app` | Open an app by name or alias |
| `focus_app` | Bring a running app to the foreground |
| `quit_app` | Quit a running app gracefully |
| `list_running_apps` | List all currently open apps |
| `set_volume` | Set system volume 0–100 |
| `open_url` | Open a URL in the default browser |

### Built-in aliases

Say natural names — the server resolves them automatically:

| You say | Opens |
|---|---|
| browser / chrome | Google Chrome |
| code / cursor | Cursor |
| messages / beeper | Beeper Desktop |
| vpn / protonvpn | ProtonVPN |
| terminal | Terminal |

---

## Requirements

- macOS
- Node.js 18+ — download from [nodejs.org](https://nodejs.org) if needed

---

## Install

```bash
git clone https://github.com/gabeperez/macos-app-launcher.git
cd macos-app-launcher
npm install
chmod +x start.sh
```

> ⚠️ The `chmod +x start.sh` step is required. You'll get an `EACCES` error in VoiceOS if you skip it.

---

## Connect to VoiceOS

**Settings → Integrations → Custom Integrations → Add**

| Field | Value |
|---|---|
| Name | 🚀 Launcher |
| Launch command | `/absolute/path/to/macos-app-launcher/start.sh` |

For example: `/Users/yourname/macos-app-launcher/start.sh`

Then speak:

- *"Open Chrome"*
- *"Launch Spotify"*
- *"Focus Slack"*
- *"Quit Discord"*
- *"Set volume to 40"*
- *"Open github.com"*
- *"What apps are open?"*

---

## Connect to Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "macos-launcher": {
      "command": "/absolute/path/to/macos-app-launcher/node_modules/.bin/tsx",
      "args": ["/absolute/path/to/macos-app-launcher/macos-app-launcher.ts"]
    }
  }
}
```

---

## Why faster than macos-mcp?

`macos-mcp` runs via `bun` with a full JS runtime init on every invocation. This server uses `open -a` (~50ms, native macOS) and `osascript` directly — no heavy dependencies, no startup delay.

---

## License

MIT
