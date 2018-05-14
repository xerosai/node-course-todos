const env = process.env.NODE_ENV;

if (env === 'development' || env === 'testing') {
    const config = require('./config.json');
    console.log(config);
    const envConfig = config[env];

    Object.keys(envConfig).forEach(key => {
        process.env[key] = envConfig[key];
    });
}
