async function main() {
  const res = await fetch('https://developers.hostinger.com/openapi/openapi.json');
  const spec = await res.json();
  const paths = Object.keys(spec.paths);
  console.log('All Endpoints Found:');
  console.log(paths);
}
main().catch(console.error);
