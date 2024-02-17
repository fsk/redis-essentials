import {createClient} from "redis";
const client = createClient();
await client.connect();
const result = await client.PING(`Ayaktayim`);
console.log(`${result}`);
client
    .quit()
    .then(r => console.log(`${r}`))
    .catch(err => console.log(`${err}`));