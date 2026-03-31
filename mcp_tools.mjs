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
  const ds = tools.tools.find(t => t.name === "hosting_deployStaticWebsite");
  const dja = tools.tools.find(t => t.name === "hosting_deployJsApplication");
  console.log("Static:", JSON.stringify(ds, null, 2));
  console.log("JS App:", JSON.stringify(dja, null, 2));
  
  process.exit();
}
main().catch(console.error);
