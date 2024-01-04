import { createClient} from "redis";

const client = createClient();

import Queue from "./queue.js";

const logsQueue = new Queue("logs", client);

await client.connect();

function logMessage() {
    logsQueue.pop(function (err, replies) {
        let queueName = replies[0];
        let message = replies[1];
        console.log("[consumer] Got log: " + message);

        logsQueue.size(function (err, size) {
            console.log(size + " logs left");
        });
        logMessage();
    })
}


logMessage();