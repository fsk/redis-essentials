import {createClient} from "redis";
import Queue from "./queue.js";

const client = createClient();

await client.connect();

const logsQueue = new Queue("logs", client);

const MAX = 5;

for (let i = 0; i < MAX; i++) {
    logsQueue.push("Hello World # " + i);
}

console.log(`Created ${MAX} Logs`);

client
    .quit()
    .then(r => {
    console.log(`${r} => Quit` )
}).catch(err => {
    console.log(`Error : ${err} `)
});