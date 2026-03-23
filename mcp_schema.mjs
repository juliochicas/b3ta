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
  for (const t of toolsResult.tools) {
     if (t.name === 'DNS_updateDNSRecordsV1' || t.name === 'DNS_getDNSRecordsV1') {
       console.log("SCHEMA FOR", t.name, ":", JSON.stringify(t.inputSchema, null, 2));
     }
  }
  process.exit(0);
}

main().catch(console.error);
