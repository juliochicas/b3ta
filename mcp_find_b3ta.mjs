import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const API_TOKEN = "7FlDciiurWlVqyVIXGv6zEbQ0drsgrdzEr0B0foIaa5a9bf4";
const DOMAIN = "b3ta.us";

async function callTool(client, name, args) {
  try {
    const result = await client.callTool({ name, arguments: args });
    return result.content?.[0]?.text || JSON.stringify(result);
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

  const client = new Client({ name: "b3ta-ssl-fix", version: "1.0" }, { capabilities: {} });
  await client.connect(transport);
  console.log("Connected to Hostinger MCP\n");

  // Step 1: Get ALL websites (paginated) to find b3ta.us
  console.log("=== STEP 1: LIST ALL WEBSITES ===");
  const allWebsites = await callTool(client, "hosting_listWebsitesV1", {});
  console.log(allWebsites);
  
  const parsed = JSON.parse(allWebsites);
  const b3ta = parsed.data?.find(w => w.domain === DOMAIN);
  
  if (b3ta) {
    console.log(`\n✅ Found b3ta.us! username: ${b3ta.username}, order_id: ${b3ta.order_id}`);
  } else {
    console.log(`\nℹ️  b3ta.us not in first page. All domains found:`);
    parsed.data?.forEach(w => console.log(` - ${w.domain} (order: ${w.order_id})`));
    console.log(`\nTotal websites: ${parsed.meta?.total || 'unknown'}`);
  }

  // Step 2: Find ALL tools containing "ssl" or "cert" or "domain" in name
  const { tools } = await client.listTools();
  console.log("\n=== STEP 2: ALL HOSTING TOOLS WITH DOMAIN PARAM ===");
  const domainTools = tools.filter(t => {
    const props = Object.keys(t.inputSchema?.properties || {});
    return props.includes('domain') && t.name.startsWith('hosting_');
  });
  domainTools.forEach(t => {
    console.log(`${t.name} (required: ${JSON.stringify(t.inputSchema?.required)})`);
    console.log(`  ${t.description?.substring(0, 150)}`);
  });

  // Step 3: Verify domain ownership
  console.log("\n=== STEP 3: VERIFY DOMAIN ===");
  const verify = await callTool(client, "hosting_verifyDomainOwnershipV1", { domain: DOMAIN });
  console.log(verify);

  // Step 4: Try to get website details for b3ta.us
  const websiteDetailTool = tools.find(t => 
    t.name.toLowerCase().includes('getwebsite') || 
    t.name.toLowerCase().includes('websitedetail') ||
    (t.name.toLowerCase().includes('hosting') && t.name.toLowerCase().includes('detail'))
  );
  
  if (websiteDetailTool) {
    console.log(`\n=== STEP 4: GET WEBSITE DETAILS (${websiteDetailTool.name}) ===`);
    const detail = await callTool(client, websiteDetailTool.name, { domain: DOMAIN });
    console.log(detail);
  }

  // Step 5: Look for SSL-specific tools
  console.log("\n=== STEP 5: CHECK ALL TOOLS FOR SSL ===");
  const sslTools = tools.filter(t => 
    JSON.stringify(t).toLowerCase().includes('ssl') ||
    JSON.stringify(t).toLowerCase().includes('certif') ||
    JSON.stringify(t).toLowerCase().includes('https')
  );
  console.log(`SSL-related tools found: ${sslTools.length}`);
  sslTools.forEach(t => console.log(` - ${t.name}`));

  process.exit(0);
}

main().catch(e => { console.error("Fatal:", e); process.exit(1); });
