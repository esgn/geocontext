import { MCPServer } from "mcp-framework";

import { dirname } from "path";
import { fileURLToPath } from "url";

// Get the directory of the current module (dist directory)
const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Available transports
 */
const TRANSPORTS : Record<string, any> = {
  'stdio' : {
    type: "stdio"
  },
  'http' : {
    type: "http-stream",
    options: {
      port: 3000,
      cors: {
        allowOrigin: "*"
      }
    }
  }
}


async function main() {
  // get transport type from environment variable
  const TRANSPORT_TYPE = process.env.TRANSPORT_TYPE || "stdio";
  if ( TRANSPORT_TYPE !== "stdio" && TRANSPORT_TYPE !== "http" ){
    throw new Error(`Invalid transport type: ${TRANSPORT_TYPE}`);
  }

  // start MCP server
  const mcpServer = new MCPServer({
    basePath: __dirname,
    transport: TRANSPORTS[TRANSPORT_TYPE],
  });
  await mcpServer.start();
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
