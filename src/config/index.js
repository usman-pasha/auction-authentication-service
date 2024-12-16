const config = {
    PORT: 5006,
    // MONGO_URI: 'mongodb://root:testing@db:27017/auction?authSource=admin',
    // MONGO_URI: 'mongodb://127.0.0.1:27017/auction',
    MONGO_URI: 'mongodb://root:testing@mongo:27017/auction?authSource=admin',
    ACCESS_SECRET: "23ty7hfe2oidhuwgjoifjfe",
    ACCESS_VALIDITY: '1d',
    REFRESH_SECRET: "vhjqhevuwhufeijoi13431hy",
    REFRESH_VALIDITY: '7d',
}

export { config }