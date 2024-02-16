import {createClient} from "redis";

const publisher = createClient();

const channelName = "Article:1234";
const messageName = "Redis With Node.js";

const startPublisher = async () => {

    await publisher.connect();

    await publisher.PUBLISH(`${channelName}`, messageName);

    console.log(`Message yayinlandi`);

    await publisher.disconnect();
};

startPublisher()
    .catch(err => console.log(`If Err ==> ${err}`));