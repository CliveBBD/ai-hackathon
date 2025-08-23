import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { getHelloContext } from "./tools/hello";
import { logger } from "./lib/logger";


class RecruitmentMcpServer {
  private server: McpServer;

  constructor() {
    this.server = new McpServer(
      {
        name: 'recruitment-mcp-server',
        version: '1.0.0'
      },
      {
        capabilities: {
          resources: {},
          tools: {}
        }
      }
    );

    this.setupTools();
    this.setupErrorHandling();
  }



  private setupTools(): void {
    this.server.tool(
      'getHelloContext',
      'Returns a simple context message',
      async () => {
        return getHelloContext();
      }
    );
  }

  private setupErrorHandling(): void {
    process.on('uncaughtException', (error: Error) => {
      logger.error('Uncaught exception', error);
      process.exit(1);
    });

    process.on('unhandledRejection', (reason: any) => {
      logger.error('Unhandled rejection:', reason);
      process.exit(1);
    });
  }

  public async start(): Promise<void> {
    try {
      const transport = new StdioServerTransport();
      await this.server.connect(transport);

      logger.info('✅ MCP Server started');

    } catch (error) {
      logger.error('❌ Failed to start MCP server', error);
      process.exit(1);
    }
  }
}

const server = new RecruitmentMcpServer();
server.start().catch((error: Error) => {
  logger.error('Fatal error during server startup', error);
  process.exit(1);
});