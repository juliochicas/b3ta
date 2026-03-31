import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const API_TOKEN = "7FlDciiurWlVqyVIXGv6zEbQ0drsgrdzEr0B0foIaa5a9bf4";
const DOMAIN = "b3ta.us";
const USERNAME = "u257345246";
const ORDER_ID = 201566115;

async function callTool(client, name, args) {
  try {
    const result = await client.callTool({ name, arguments: args });
    const text = result.content?.[0]?.text || JSON.stringify(result);
    return text;
  } catch (e) {
    return `ERROR: ${e.message}`;
  }
}

async function main() {
  const transport = new StdioClientTransport({
    command: "npx",
    args: ["--yes", "hostinger-api-mcp@latest"],
    env: { ...process.env, API_TOKEN }
  });

  const client = new Client({ name: "b3ta-ssl-renew", version: "1.0" }, { capabilities: {} });
  await client.connect(transport);
  console.log("Connected to Hostinger MCP\n");

  const { tools } = await client.listTools();

  // --- List all tools that have domain/username params ---
  console.log("=== ALL TOOLS WITH DOMAIN/USERNAME PARAMS ===");
  tools.forEach(t => {
    const props = Object.keys(t.inputSchema?.properties || {});
    if (props.some(p => ['domain', 'username', 'hosting_id', 'order_id'].includes(p))) {
      console.log(`${t.name} | required: ${JSON.stringify(t.inputSchema?.required)} | props: ${JSON.stringify(props)}`);
    }
  });

  // --- Try SSH/cPanel/MySQL tools ---
  console.log("\n=== LOOKING FOR SSH ACCESS TOOLS ===");
  const sshTools = tools.filter(t => 
    t.name.toLowerCase().includes('ssh') ||
    t.name.toLowerCase().includes('ftp') ||
    t.name.toLowerCase().includes('cpanel') ||
    t.name.toLowerCase().includes('exec') ||
    t.name.toLowerCase().includes('command') ||
    t.name.toLowerCase().includes('shell')
  );
  sshTools.forEach(t => console.log(` - ${t.name}: ${t.description?.substring(0, 100)}`));

  // --- Try the cron/command execution tools ---
  console.log("\n=== LOOKING FOR CRON/EXEC TOOLS ===");
  const cronTools = tools.filter(t => 
    t.name.toLowerCase().includes('cron') || 
    t.name.toLowerCase().includes('cronjob')
  );
  cronTools.forEach(t => {
    console.log(` - ${t.name}`);
    console.log(`   ${t.description?.substring(0, 200)}`);
    console.log(`   Required: ${JSON.stringify(t.inputSchema?.required)}`);
    console.log(`   Props: ${JSON.stringify(Object.keys(t.inputSchema?.properties || {}))}`);
  });

  // --- Try the Git/Deploy tools ---  
  console.log("\n=== ALL NON-VPS, NON-DNS, NON-BILLING TOOLS ===");
  tools
    .filter(t => !t.name.startsWith('VPS_') && !t.name.startsWith('DNS_') && !t.name.startsWith('billing_') && !t.name.startsWith('domains_') && !t.name.startsWith('hosting_'))
    .forEach(t => {
      console.log(`${t.name} | ${t.description?.substring(0, 100)}`);
    });

  process.exit(0);
}

main().catch(e => { console.error("Fatal:", e); process.exit(1); });
