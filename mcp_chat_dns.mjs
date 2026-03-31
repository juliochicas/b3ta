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

  // Get current DNS
  const result = await client.callTool({
    name: "DNS_getDNSRecordsV1",
    arguments: { domain: "b3ta.us" }
  });
  
  const recordsStr = result.content[0].text;
  let zone = JSON.parse(recordsStr);
  
  // Add chat subdomain pointing to the VPS
  zone.push({
    name: "chat",
    type: "A",
    ttl: 300,
    records: [{ content: "157.173.215.253" }]
  });

  // Since we can't individually PATCH multiple records easily, the Hostinger API usually requires full zone payload for update or using the UI.
  // Wait, DNS_updateDNSRecordsV1 with overwrite: false allows adding a record! Let's try just sending the new record!
  const payload = {
    domain: "b3ta.us",
    overwrite: false,
    zone: [
      {
        name: "chat",
        type: "A",
        ttl: 300,
        records: [ { content: "157.173.215.253" } ]
      }
    ]
  };

  console.log("Adding chat.b3ta.us A record...");
  const updateResult = await client.callTool({ 
    name: "DNS_updateDNSRecordsV1", 
    arguments: payload 
  });
  
  console.log("UPDATE RESULT:", JSON.stringify(updateResult, null, 2));

  process.exit(0);
}

main().catch(console.error);
