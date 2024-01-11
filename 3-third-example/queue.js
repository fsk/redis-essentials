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
    console.log(this.redisClient.brPop(this.queueKey, this.timeOut));
};

export default Queue;

//queues:logs