import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { Sandbox } from '@e2b/code-interpreter'

export const configSchema = z.object({
  debug: z.boolean().default(false).describe("Enable debug logging"),
  E2B_API_KEY: z.string().describe("E2B API key for authentication"),
});

export default function createStatelessServer({
  config,
}: {
  config: z.infer<typeof configSchema>;
}) {
  const server = new McpServer({
    name: "E2B Remote MCP",
    version: "1.0.0",
  });

  const getSandbox = async (sandboxId: string) => {
    return await Sandbox.connect(sandboxId, { apiKey: config.E2B_API_KEY });
  };

  server.tool(
    "create_sandbox",
    "Create a new E2B sandbox",
    {
      timeoutMs: z.number().optional().describe("Timeout in milliseconds"),
    },
    async ({ timeoutMs }) => {
      const sandbox = await Sandbox.create({ timeoutMs, apiKey: config.E2B_API_KEY });
      return {
        content: [{ type: "text", text: `Sandbox created with ID: ${sandbox.sandboxId}` }],
      };
    }
  );

  server.tool(
    "run_command",
    "Run a command in the sandbox",
    {
      command: z.string().describe("Command to run"),
      background: z.boolean().optional().describe("Run command in background"),
      sandboxId: z.string().describe("Sandbox ID"),
    },
    async ({ command, background, sandboxId }) => {
      const sandbox = await getSandbox(sandboxId);
      const result = await sandbox.commands.run(command, { background });
      return {
        content: [{ 
          type: "text", 
          text: `Exit code: ${result.exitCode}\nStdout: ${result.stdout}\nStderr: ${result.stderr}` 
        }],
      };
    }
  );

  server.tool(
    "read_file",
    "Read a file from the sandbox",
    {
      filePath: z.string().describe("Path to the file"),
      sandboxId: z.string().describe("Sandbox ID"),
    },
    async ({ filePath, sandboxId }) => {
      const sandbox = await getSandbox(sandboxId);
      const content = await sandbox.files.read(filePath);
      return {
        content: [{ type: "text", text: content }],
      };
    }
  );

  server.tool(
    "write_file",
    "Write content to a file in the sandbox",
    {
      filePath: z.string().describe("Path to the file"),
      fileContents: z.string().describe("Content to write"),
      sandboxId: z.string().describe("Sandbox ID"),
    },
    async ({ filePath, fileContents, sandboxId }) => {
      const sandbox = await getSandbox(sandboxId);
      await sandbox.files.write(filePath, fileContents);
      return {
        content: [{ type: "text", text: `File ${filePath} written successfully` }],
      };
    }
  );

  server.tool(
    "list_files",
    "List files in a directory",
    {
      folderPath: z.string().describe("Path to the folder"),
      sandboxId: z.string().describe("Sandbox ID"),
    },
    async ({ folderPath, sandboxId }) => {
      const sandbox = await getSandbox(sandboxId);
      const files = await sandbox.files.list(folderPath);
      return {
        content: [{ type: "text", text: files.map(f => f.name).join('\n') }],
      };
    }
  );

  server.tool(
    "run_code",
    "Run code in the sandbox",
    {
      code: z.string().describe("Code to execute"),
      sandboxId: z.string().describe("Sandbox ID"),
    },
    async ({ code, sandboxId }) => {
      const sandbox = await getSandbox(sandboxId);
      const result = await sandbox.runCode(code);
      return {
        content: [{ 
          type: "text", 
          text: `Results: ${result.results.map(r => r.text || r.png || r.html || r.svg || r.json).join('\n')}` 
        }],
      };
    }
  );

  server.tool(
    "get_sandbox_url",
    "Get the URL for a sandbox on a specific port",
    {
      port: z.number().describe("Port number"),
      sandboxId: z.string().describe("Sandbox ID"),
    },
    async ({ port, sandboxId }) => {
      const sandbox = await getSandbox(sandboxId);
      const host = sandbox.getHost(port);
      return {
        content: [{ type: "text", text: `https://${host}` }],
      };
    }
  );

  server.tool(
    "kill_sandbox",
    "Kill a sandbox",
    {
      sandboxId: z.string().describe("Sandbox ID"),
    },
    async ({ sandboxId }) => {
      const sandbox = await getSandbox(sandboxId);
      await sandbox.kill();
      return {
        content: [{ type: "text", text: `Sandbox ${sandboxId} killed successfully` }],
      };
    }
  );

  return server.server;
}
