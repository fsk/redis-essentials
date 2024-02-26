import { createClient } from "redis";

const client = createClient();

await client.connect();


const luaScript = "return 'Hello, Scripting.!'";

const result = await client.eval(luaScript, "0");

console.log(`Result ==> ${result}`);