import { createClient } from "redis";
import {readFile} from "fs/promises";

const client = createClient();

await client.connect();

const path1 = "/Users/fsk/Desktop/coding/redis-essentials/redis-with-lua/Script1.lua";
const path2 = "/Users/fsk/Desktop/coding/redis-essentials/redis-with-lua/LuaScript2.lua";
const luaScript = await readFile(path1);
const result = await client.eval(luaScript, "0");
console.log(`Result ==> ${result}`);
const key = "americanPresidents";
const luaScript2 = await readFile(path2);
const result2 = await client.eval(luaScript2, 1, `${key}`);

result2.forEach(item => {
    console.log(item)
})



console.log("\n")
console.log(`== Finish ==`)
console.log("\n")
client
    .quit()
    .then(item => console.log(item))
    .catch(err => console.log(err));
