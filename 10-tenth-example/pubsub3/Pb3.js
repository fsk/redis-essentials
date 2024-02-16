import {createClient} from "redis";

const publisher = createClient();

const channelName = process.argv[2];
const message = process.argv.slice(3).join(' ');

async function publishMessage(channelName, message) {
    await publisher.connect();
    await publisher.PUBLISH(channelName, message);
    console.log(`${channelName} adli kanala '${message}' mesaji gonderildi.`);
    await publisher.disconnect();
}

publishMessage(channelName, message)
    .catch(err => console.log(err));