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

  const payload = {
    domain: "b3ta.us",
    overwrite: true,
    zone: [
      {
        name: "@",
        type: "ALIAS",
        ttl: 300,
        records: [ { content: "b3ta.us.cdn.hstgr.net." } ]
      },
      {
        name: "www",
        type: "CNAME",
        ttl: 300,
        records: [ { content: "www.b3ta.us.cdn.hstgr.net." } ]
      }
    ]
  };

  console.log("Fixing DNS Records to use Hostinger CDN...");
  const result = await client.callTool({ 
    name: "DNS_updateDNSRecordsV1", 
    arguments: payload 
  });
  
  console.log("FIX RESULT:", JSON.stringify(result, null, 2));
  process.exit(0);
}

main().catch(console.error);
