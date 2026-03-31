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
  
  console.log("Deploying static website to b3ta.us...");
  const result = await client.callTool({
    name: "hosting_deployStaticWebsite",
    arguments: {
      domain: "b3ta.us",
      archivePath: "/Users/jchicas/b3ta/b3ta_20260324_140000.zip",
      removeArchive: false
    }
  });
  
  console.log(JSON.stringify(result, null, 2));
  process.exit();
}
main().catch(console.error);
