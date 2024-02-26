import { createClient } from "redis";
import { readFile } from "fs/promises";

const client = createClient();

await client.connect();


//let scriptContent = fs.readFileSync(`${__dirname}/Script1.lua`, { encoding: 'utf-8' });

const scriptContent = await readFile('/Users/fsk/Desktop/coding/redis-essentials/12-twelve-example/Script1.lua');

let result = await client.eval(scriptContent, 0);

console.log(`Eval Result ==> ${result}`);

client
    .quit()
    .then(item => console.log(item))
    .catch(err => console.log(err));
