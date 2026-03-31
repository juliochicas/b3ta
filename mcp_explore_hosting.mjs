import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const API_TOKEN = "7FlDciiurWlVqyVIXGv6zEbQ0drsgrdzEr0B0foIaa5a9bf4";
const DOMAIN = "b3ta.us";

async function callTool(client, name, args) {
  try {
    console.log(`\n>>> Calling ${name} with`, JSON.stringify(args));
    const result = await client.callTool({ name, arguments: args });
    const text = result.content?.[0]?.text || JSON.stringify(result);
    console.log("Result:", text.substring(0, 2000));
    return text;
  } catch (e) {
    console.log(`ERROR calling ${name}:`, e.message);
    return null;
  }
}

async function main() {
  const transport = new StdioClientTransport({
    command: "npx",
    args: ["--yes", "hostinger-api-mcp@latest"],
    env: { ...process.env, API_TOKEN }
  });

  const client = new Client({ name: "ssl-fix-client", version: "1.0" }, { capabilities: {} });
  await client.connect(transport);

  const { tools } = await client.listTools();
  console.log(`Connected. Found ${tools.length} tools.\n`);

  // Print ALL tool names
  console.log("=== ALL TOOLS ===");
  tools.forEach(t => console.log(t.name));

  // Find hosting-related tools
  const hostingTools = tools.filter(t => 
    t.name.toLowerCase().includes('hosting') ||
    t.name.toLowerCase().includes('website') ||
    t.name.toLowerCase().includes('ssl') ||
    t.name.toLowerCase().includes('cert')
  );
  
  console.log("\n=== HOSTING/SSL RELEVANT TOOLS ===");
  hostingTools.forEach(t => {
    console.log(`\n${t.name}:`);
    console.log(`  Desc: ${t.description?.substring(0, 200)}`);
    console.log(`  Required: ${JSON.stringify(t.inputSchema?.required)}`);
  });

  // Try to list websites (no required params)
  const noParamTools = hostingTools.filter(t => {
    const req = t.inputSchema?.required || [];
    return req.length === 0;
  });
  
  console.log(`\n=== TOOLS WITH NO REQUIRED PARAMS (${noParamTools.length}) ===`);
  for (const t of noParamTools) {
    await callTool(client, t.name, {});
  }

  process.exit(0);
}

main().catch(e => { console.error("Fatal:", e); process.exit(1); });
