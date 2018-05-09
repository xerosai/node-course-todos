const env = process.env.NODE_ENV;

if (env === 'testing') {
    process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTesting';
}
