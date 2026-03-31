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
  
  const result = await client.callTool({
    name: "DNS_getDNSRecordsV1",
    arguments: { domain: "b3ta.us" }
  });
  console.log("DNS RECORDS:", result.content[0].text);
  process.exit(0);
}
main().catch(console.error);
