local americanPresidentsTable = {1732, "George Washington", 1809, "Abraham Lincoln", 1858, "Theodore Roosevelt"}
return redis.call("ZADD", "americanPresidents", unpack(americanPresidentsTable))
