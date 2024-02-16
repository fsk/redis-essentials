import os from 'os';
import {createClient} from "redis";

const client = createClient();

await client.connect();

const COMMANDS = {};

COMMANDS.DATE = function () {
    const now = new Date();
    console.log(`DATE => ${now.toISOString()}`);
}

COMMANDS.PING = function () {
    console.log("PONG");
}

COMMANDS.HOSTNAME = function () {
    console.log(`HOSTNAME => ${os.hostname}`);
}

client.on("message", function (channel, commandName) {
    if (COMMANDS.hasOwnProperty(commandName)) {
        const commandFunction = COMMANDS[commandName];
        commandFunction();
    }else {
        console.log("Unknown command: " + commandName);
    }
});

await client.subscribe("global", process.argv[2]);