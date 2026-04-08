const fs = require('fs');
fetch('https://api.supabase.com/v1/projects/deshthuuvxghhzoaslkc/api-keys', { 
    headers: { 'Authorization': 'Bearer sbp_d37720a0302e4abc5a91b32c773f3bfd7ddb441a' } 
})
.then(r => r.json())
.then(d => { 
    const anon = d.find(k => k.name === 'anon'); 
    const sr = d.find(k => k.name === 'service_role' || k.id === 'service_role'); 
    fs.writeFileSync('keys.json', JSON.stringify({anon: anon.api_key, service_role: sr.api_key}, null, 2));
});
