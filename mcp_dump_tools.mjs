import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import fs from 'fs';

async function main() {
  const transport = new StdioClientTransport({
    command: "npx",
    args: ["--yes", "hostinger-api-mcp@latest"],
    env: { ...process.env, API_TOKEN: "7FlDciiurWlVqyVIXGv6zEbQ0drsgrdzEr0B0foIaa5a9bf4" }
  });
  const client = new Client({ name: "cli", version: "1" }, { capabilities: {} });
  await client.connect(transport);
  const tools = await client.listTools();
  
  fs.writeFileSync('hostinger_tools.json', JSON.stringify(tools.tools, null, 2));

  process.exit();
}
main().catch(console.error);
