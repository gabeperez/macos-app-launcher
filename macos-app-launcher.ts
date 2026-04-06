#!/usr/bin/env tsx
/**
 * macos-app-launcher — lightweight macOS app launcher MCP for VoiceOS
 * Uses `open -a` and osascript directly, no heavy dependencies.
 * Much faster than macos-mcp which loads a full bun runtime.
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { execFile } from "child_process";
import { promisify } from "util";

const exec = promisify(execFile);

const APP_ALIASES: Record<string, string> = {
  // Browsers
  chrome: "Google Chrome",
  browser: "Google Chrome",
  safari: "Safari",
  // Dev
  cursor: "Cursor",
  code: "Cursor",
  xcode: "Xcode",
  sublime: "Sublime Text",
  opencode: "OpenCode",
  terminal: "Terminal",
  // AI
  claude: "Claude",
  ollama: "Ollama",
  voiceos: "VoiceOS",
  // Comms
  beeper: "Beeper Desktop",
  messages: "Beeper Desktop",
  discord: "Discord",
  slack: "Slack",
  // Media
  spotify: "Spotify",
  photomator: "Photomator",
  capcut: "CapCut",
  // Productivity
  raycast: "Raycast",
  finder: "Finder",
  notes: "Notes",
  conductor: "Conductor",
  // System
  vpn: "ProtonVPN",
  protonvpn: "ProtonVPN",
  tailscale: "Tailscale",
};

function resolveApp(name: string): string {
  return APP_ALIASES[name.toLowerCase().trim()] ?? name.trim();
}

async function osascript(script: string): Promise<string> {
  const { stdout } = await exec("osascript", ["-e", script]);
  return stdout.trim();
}

const server = new McpServer({ name: "macos-app-launcher", version: "1.0.0" });

server.tool(
  "open_app",
  "Instantly open a macOS application by name or alias. Say: 'open Chrome', 'launch Spotify', 'open Cursor', 'open Slack', 'open Discord', 'open Beeper', 'open Claude', 'open Terminal'. Aliases: browser=Chrome, code=Cursor, messages=Beeper, vpn=ProtonVPN.",
  { app_name: z.string().describe("App name or alias to open") },
  async ({ app_name }) => {
    const app = resolveApp(app_name);
    try {
      await exec("open", ["-a", app]);
      return { content: [{ type: "text", text: `Opened ${app}` }] };
    } catch {
      return { content: [{ type: "text", text: `Could not open '${app}'. Is it installed?` }], isError: true };
    }
  }
);

server.tool(
  "focus_app",
  "Bring an already-running app to the foreground. Say: 'focus Chrome', 'switch to Slack', 'bring up Spotify', 'go to Cursor', 'switch to Terminal'.",
  { app_name: z.string().describe("App name or alias to focus") },
  async ({ app_name }) => {
    const app = resolveApp(app_name);
    try {
      await osascript(`tell application "${app}" to activate`);
      return { content: [{ type: "text", text: `Focused ${app}` }] };
    } catch {
      // fallback to open -a which also focuses
      try {
        await exec("open", ["-a", app]);
        return { content: [{ type: "text", text: `Focused ${app}` }] };
      } catch {
        return { content: [{ type: "text", text: `Could not focus '${app}'` }], isError: true };
      }
    }
  }
);

server.tool(
  "quit_app",
  "Quit a running macOS application gracefully. Say: 'quit Spotify', 'close Chrome', 'quit Slack', 'close Discord', 'quit Terminal'.",
  { app_name: z.string().describe("App name or alias to quit") },
  async ({ app_name }) => {
    const app = resolveApp(app_name);
    try {
      await osascript(`tell application "${app}" to quit`);
      return { content: [{ type: "text", text: `Quit ${app}` }] };
    } catch {
      return { content: [{ type: "text", text: `Could not quit '${app}' — it may not be running` }], isError: true };
    }
  }
);

server.tool(
  "list_running_apps",
  "List all currently running macOS applications. Say: 'what apps are open?', 'show running apps', 'what is open right now?'.",
  {},
  async () => {
    try {
      const result = await osascript(
        'tell application "System Events" to get name of every application process whose background only is false'
      );
      const apps = result.split(", ").sort().join(", ");
      return { content: [{ type: "text", text: `Running: ${apps}` }] };
    } catch {
      return { content: [{ type: "text", text: "Could not get running apps" }], isError: true };
    }
  }
);

server.tool(
  "set_volume",
  "Set the system volume from 0 to 100. Say: 'set volume to 50', 'volume 80', 'mute' (0), 'turn it down to 20'.",
  { level: z.number().min(0).max(100).describe("Volume level 0-100") },
  async ({ level }) => {
    await exec("osascript", ["-e", `set volume output volume ${Math.round(level)}`]);
    return { content: [{ type: "text", text: level === 0 ? "Muted" : `Volume set to ${level}%` }] };
  }
);

server.tool(
  "open_url",
  "Open a URL in the default browser. Say: 'open google.com', 'go to github.com', 'open notion.so'. Adds https:// automatically.",
  { url: z.string().describe("URL to open") },
  async ({ url }) => {
    const target = url.startsWith("http") ? url : `https://${url}`;
    try {
      await exec("open", [target]);
      return { content: [{ type: "text", text: `Opened ${target}` }] };
    } catch {
      return { content: [{ type: "text", text: `Could not open ${target}` }], isError: true };
    }
  }
);

await server.connect(new StdioServerTransport());
