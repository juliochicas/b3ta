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
  console.log("Connected to Hostinger MCP.");

  console.log("Resetting DNS records to default...");
  const result = await client.callTool({ 
    name: "DNS_resetDNSRecordsV1", 
    arguments: { domain: "b3ta.us" } 
  });
  
  console.log("RESTORE RESULT:", JSON.stringify(result, null, 2));

  // Also query the updated DNS to verify
  const verify = await client.callTool({
    name: "DNS_getDNSRecordsV1",
    arguments: { domain: "b3ta.us" }
  });
  console.log("NEW DNS RECORDS:", JSON.stringify(verify, null, 2));

  process.exit(0);
}

main().catch(console.error);
