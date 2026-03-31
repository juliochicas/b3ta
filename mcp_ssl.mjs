import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
async function main() {
  const transport = new StdioClientTransport({
    command: "npx",
    args: ["--yes", "hostinger-api-mcp@latest"],
    env: { ...process.env, API_TOKEN: "7FlDciiurWlVqyVIXGv6zEbQ0drsgrdzEr0B0foIaa5a9bf4" }
  });
  const client = new Client({ name: "cli", version: "1" }, { capabilities: {} });
  await client.connect(transport);
  const tools = await client.listTools();
  
  const sslTools = tools.tools.filter(t => t.name.toLowerCase().includes('ssl'));
  
  for (const t of sslTools) {
    console.log(t.name);
    console.log(t.description);
    console.log(JSON.stringify(t.inputSchema, null, 2));
    console.log('---');
  }

  process.exit();
}
main().catch(console.error);
