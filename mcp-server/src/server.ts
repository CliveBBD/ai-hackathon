// src/server.ts
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

async function main() {
  const server = new McpServer({
    name: "example-server",
    version: "0.0.1",
  });

  server.tool(
    "getHelloContext",
    "Returns a simple context message",
    async () => {
      return {
        content: [
          {
            type: "text",
            text: "Hello from the MCP server! This is your starting context.",
          },
        ],
      };
    }
  );

  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error("Server failed to start:", err);
  process.exit(1);
});
