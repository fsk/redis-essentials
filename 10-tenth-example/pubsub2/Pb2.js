import {createClient} from "redis";

const publisher = createClient();

async function publishMessage(channelName, message) {
    await publisher.connect();
    await publisher.PUBLISH(channelName, message);
    console.log(`${channelName} kanaline ${message} gonderildi.`);
    await publisher.disconnect();
}

async function startPublishing() {
    try {
        await publishMessage("Article:1234", "Redis With Node.js");
        await publishMessage("News:5678", "News update");
    }catch (err) {
        console.log(`Error ==> ${err}`);
    }
}

startPublishing()
    .catch(err => console.log(`${err}`));