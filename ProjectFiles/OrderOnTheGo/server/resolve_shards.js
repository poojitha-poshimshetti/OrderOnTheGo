const dns = require('dns');

const srvRecord = '_mongodb._tcp.cluster0.kzwxete.mongodb.net';

console.log(`Resolving SRV record: ${srvRecord}...`);

dns.resolveSrv(srvRecord, (err, addresses) => {
    if (err) {
        console.error('❌ DNS SRV Resolution Failed:', err.message);
        console.log('\nTrying direct lookup using Google DNS...');
        // We can't easily do a cross-DNS lookup in pure Node without libraries, 
        // but we can suggest the user does it or try to guess the shards.
        process.exit(1);
    }

    console.log('✅ Shards found:');
    addresses.sort((a, b) => a.name.localeCompare(b.name)).forEach(addr => {
        console.log(`- ${addr.name}:${addr.port}`);
    });

    const hosts = addresses.map(addr => `${addr.name}:${addr.port}`).join(',');
    console.log('\nStandard Connection String (Bypass Format):');
    console.log(`mongodb://ppooji5633_db_user:<password>@${hosts}/orderonthego?ssl=true&replicaSet=atlas-xxxxxx-shard-0&authSource=admin`);
    console.log('\nNote: You need the exact replicaSet name from Atlas (found in "Primary" node name or "Connect" dialog).');
});
