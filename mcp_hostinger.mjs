import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

async function main() {
  const transport = new StdioClientTransport({
    command: "npx",
    args: ["--yes", "hostinger-api-mcp@latest"],
    env: { ...process.env, API_TOKEN: "7FlDciiurWlVqyVIXGv6zEbQ0drsgrdzEr0B0foIaa5a9bf4" }
  });

  const client = new Client({ name: "cli-client", version: "1.0.0" }, { capabilities: {} });
  await client.connect(transport);
  
  const toolsResult = await client.listTools();
  console.log("ALL TOOL NAMES STARTING WITH DNS_:");
  for (const t of toolsResult.tools) {
     if (t.name.toUpperCase().includes('DNS')) {
       console.log(t.name);
     }
  }
  process.exit(0);
}

main().catch(console.error);
