local result = redis.call('ZRANGE', 'americanPresidents', 0, -1, 'WITHSCORES');
return result