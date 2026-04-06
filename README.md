# macOS App Launcher

A lightweight MCP server that lets AI assistants open, focus, quit, and control macOS applications instantly.

Built for [VoiceOS](https://voiceos.app) but works with any MCP-compatible client.

## What it does

| Tool | Description |
|------|-------------|
| `open_app` | Launch any macOS app by name or alias |
| `focus_app` | Bring a running app to the foreground |
| `quit_app` | Gracefully quit an app |
| `list_running_apps` | Show all visible running apps |
| `set_volume` | Set system volume (0-100) |
| `open_url` | Open a URL in the default browser |

## Built-in aliases

Common names are mapped to their macOS app names so voice commands feel natural:

```
chrome, browser  →  Google Chrome
code, cursor     →  Cursor
messages         →  Beeper Desktop
vpn              →  ProtonVPN
claude           →  Claude
spotify          →  Spotify
terminal         →  Terminal
```

See `APP_ALIASES` in `fast-launcher.ts` for the full list.

## Install

```bash
git clone https://github.com/gabepz/macos-app-launcher.git
cd macos-app-launcher
npm install
```

## Usage

### As a standalone MCP server

```bash
./start.sh
```

### With VoiceOS

See the [VoiceOS install guide](https://macos-app-launcher.pages.dev/voiceos) for step-by-step setup.

### With any MCP client

Add to your MCP client config:

```json
{
  "mcpServers": {
    "macos-app-launcher": {
      "command": "/path/to/macos-app-launcher/start.sh"
    }
  }
}
```

## How it works

Uses macOS native commands — `open -a` for launching apps and `osascript` for AppleScript control. No heavy runtimes or dependencies beyond Node.js and tsx.

## Requirements

- macOS
- Node.js 18+

## License

MIT
