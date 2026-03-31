async function main() {
  const res = await fetch('https://developers.hostinger.com/openapi/openapi.json');
  const spec = await res.json();
  const paths = Object.keys(spec.paths);
  const sslPaths = paths.filter(p => p.toLowerCase().includes('ssl') || p.toLowerCase().includes('cert'));
  console.log('SSL/Cert Endpoints Found:');
  console.log(sslPaths);

  for (const p of sslPaths) {
    console.log(`\nEndpoint: ${p}`);
    console.log(JSON.stringify(spec.paths[p], null, 2));
  }
}
main().catch(console.error);
