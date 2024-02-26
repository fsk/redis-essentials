import { createClient } from "redis";
import {readFile} from "fs/promises";

const client = createClient();

await client.connect();

const luaScript = await readFile('/Users/fsk/Desktop/coding/redis-essentials/redis-with-lua/Script1.lua');
const result = await client.eval(luaScript, "0");
console.log(`Result ==> ${result}`);
const key = "americanPresidents";
const luaScript2 = await readFile('/Users/fsk/Desktop/coding/redis-essentials/redis-with-lua/LuaScript2.lua');
const result2 = await client.eval(luaScript2, 1, "americanPresidents");


console.log(`Lua Script From Text ==> ${result2}`)



console.log("\n")
console.log(`== Finish ==`)
console.log("\n")
client
    .quit()
    .then(item => console.log(item))
    .catch(err => console.log(err));
