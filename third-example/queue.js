function Queue(queueName, redisClient) {
    this.queueName = queueName;
    this.redisClient = redisClient;
    this.queueKey = 'queues:' + queueName;
    this.timeOut = 0;
}

Queue.prototype.size = function(callback) {
    this.redisClient.lLen(this.queueKey, callback)
};

Queue.prototype.push = function (data) {
    this.redisClient.lPush(this.queueKey, data);
}


Queue.prototype.pop = function(callback) {
    this.redisClient.brPop(this.queueKey, this.timeOut, callback);
};

export default Queue;