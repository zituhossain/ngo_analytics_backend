const Queue = require('bull');

const redisConfig = {
    redis: {
        host: '127.0.0.1', // Update with your Redis server details
        port: 6379,        // Update with your Redis server port
    },
};

const combineDetailsReportQueue = new Queue('combineDetailsReport', redisConfig);

module.exports = combineDetailsReportQueue;