const TOKEN = "7FlDciiurWlVqyVIXGv6zEbQ0drsgrdzEr0B0foIaa5a9bf4";

async function fetchAPI(path) {
  const url = `https://developers.hostinger.com/api${path}`;
  console.log(`GET ${url}`);
  const res = await fetch(url, {
    headers: {
      "Authorization": `Bearer ${TOKEN}`,
      "Accept": "application/json"
    }
  });
  const data = await res.text();
  console.log(`Status: ${res.status}`);
  try {
    console.log(JSON.stringify(JSON.parse(data), null, 2).slice(0, 1500));
  } catch(e) {
    console.log(data.slice(0, 500));
  }
  console.log('---');
}

async function main() {
  // Let's first try to get websites or hosting accounts
  await fetchAPI('/hosting/v1/websites');
  await fetchAPI('/hosting/v1/websites/b3ta.us');
  // Then maybe SSL?
  await fetchAPI('/ssl/v1');
  await fetchAPI('/ssl/v1/certificates');
}

main().catch(console.error);
