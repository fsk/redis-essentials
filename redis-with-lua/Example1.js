import {createClient} from "redis";

const client = createClient();

await client.connect();

const presidents = [
    {
        "score": 1732,
        "value": "George Washington"
    },
    {
        "score": 1809,
        "value": "Abraham Lincoln"
    },
    {
        "score": 1858,
        "value": "Theodore Roosevelt"
    }
]

await client.zAdd("americanPresidents", presidents);

const luaScript = [
    'local elements = redis.call("ZRANGE", "KEYS[1]", 0, 0)',
    'redis.call("ZREM", "KEYS[1]", elements[1])',
    'return elements[1]'
].join('\n');

await client.eval(luaScript, 1, "americanPresidents");