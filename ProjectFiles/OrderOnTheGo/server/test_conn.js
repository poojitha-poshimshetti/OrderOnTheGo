const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.MONGO_URI;

console.log('Testing connection to:', uri.split('@')[1]); // Log only the host part for privacy

mongoose.connect(uri)
  .then(() => {
    console.log('✅ Success! Connected to MongoDB.');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Connection Failed!');
    console.error('Error Name:', err.name);
    console.error('Error Code:', err.code);
    console.error('Error Message:', err.message);
    if (err.message.includes('querySrv ECONNREFUSED')) {
      console.log('\n💡 This looks like a DNS issue. Your local network/ISP might be blocking MongoDB SRV records.');
      console.log('Try changing your Windows DNS settings to Google (8.8.8.8) or Cloudflare (1.1.1.1).');
    }
    process.exit(1);
  });
