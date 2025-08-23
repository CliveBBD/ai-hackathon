export const getHelloContext = async (): Promise<any> => {
  return {
    content: [
      {
        type: "text",
        text: "Hello from the MCP server! This is your starting context.",
      },
    ],
  };
};
