function Queue(queueName, redisClient) {
    this.queueName = queueName;
    this.redisClient = redisClient;
    this.queueKey = 'queues:' + queueName;
    this.timeOut = 0;
}

Queue.prototype.size = function() {
    return this.redisClient.lLen(this.queueKey);
};

Queue.prototype.push = function (data) {
    return this.redisClient.lPush(this.queueKey, data);
}

Queue.prototype.pop = function() {
    return new Promise((resolve, reject) => {
        this.redisClient.brPop(this.queueKey, this.timeOut, (err, reply) => {
            if (err) {
                console.error("Redis brPop Error:", err);
                reject(err);
            } else {
                console.log("Redis brPop Success:", reply);
                resolve(reply);
            }
        });
    });
};

export default Queue;