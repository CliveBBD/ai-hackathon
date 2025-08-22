export async function getContextFromMCP(): Promise<string> {
  await new Promise((resolve) => setTimeout(resolve, 100));

  return "This is dummy context from the MCP server.";
}
