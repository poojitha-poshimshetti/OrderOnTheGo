const mongoose = require('mongoose')
const dns = require('dns')

// Force Google DNS to bypass ISP/system DNS that blocks SRV queries
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1'])
dns.setDefaultResultOrder('ipv4first')

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 15000,
            family: 4
        })
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`)
    } catch (error) {
        console.error(`❌ MongoDB Error: ${error.message}`)
        if (error.message.includes('ECONNREFUSED') || error.message.includes('timeout') || error.message.includes('selection')) {
            console.log('\n💡 Troubleshooting Tips:')
            console.log('1. Ensure your IP (157.66.152.154) is whitelisted in MongoDB Atlas.')
            console.log('2. Check if your network/ISP blocks SRV records. If so, use the standard connection string.')
            console.log('3. Verify your MONGO_URI in the .env file.\n')
        }
        process.exit(1)
    }
}

module.exports = connectDB
