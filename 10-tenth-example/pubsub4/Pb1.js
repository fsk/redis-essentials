import { createClient } from "redis";
import readline from 'node:readline';

const publisher = createClient();
const channelName = process.argv[2];

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

async function publishMessage(channelName, message) {
    await publisher.connect();
    await publisher.PUB
}