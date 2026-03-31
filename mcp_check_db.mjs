import { createClient } from '@supabase/supabase-js';
import path from 'path';

process.loadEnvFile(path.resolve('.env'));

const url = process.env.VITE_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(url, key);

async function main() {
  console.log("Checking client_pages table...");
  const { data, error } = await supabase
    .from('client_pages')
    .select('*');
    
  if (error) {
    console.error("DB Error:", error);
  } else {
    console.log("Records:", JSON.stringify(data, null, 2));
    
    for (const record of data) {
      if (record.html_storage_path) {
        const { data: urlData } = supabase.storage
          .from('client-pages')
          .getPublicUrl(record.html_storage_path);
          
        console.log(`Testing fetch for ${record.slug}: ${urlData.publicUrl}`);
        const res = await fetch(urlData.publicUrl);
        console.log(`Fetch result: ${res.status} ${res.statusText}`);
      }
    }
  }
}

main();
