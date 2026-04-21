const fs = require('fs');

const supabasePat = process.env.SUPABASE_PAT;

if (!supabasePat) {
    console.error("Error: SUPABASE_PAT environment variable is required.");
    process.exit(1);
}

fetch('https://api.supabase.com/v1/projects/deshthuuvxghhzoaslkc/api-keys', { 
    headers: { 'Authorization': `Bearer ${supabasePat}` } 
})
.then(r => r.json())
.then(d => { 
    if (!d || !Array.isArray(d)) {
        console.error("Failed to fetch keys or invalid response:", d);
        process.exit(1);
    }
    const anon = d.find(k => k.name === 'anon'); 
    const sr = d.find(k => k.name === 'service_role' || k.id === 'service_role'); 
    fs.writeFileSync('keys.json', JSON.stringify({anon: anon?.api_key, service_role: sr?.api_key}, null, 2));
});
