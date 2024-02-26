local result = redis.call('zrange', 'americanPresidents', 0, -1);
return result