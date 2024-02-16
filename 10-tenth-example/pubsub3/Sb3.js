import {createClient} from "redis";

async function startSubscriber(channelName) {
    const subscriber = createClient();
    await subscriber.connect();
    await subscriber.subscribe(channelName, message => {
        console.log(`Message on ${channelName} ==> ${message}`);
    });

    console.log(`${channelName} kanalina abone olundu`);
}

async function initSubscribers() {
    try {
        await startSubscriber('Article:1234');
        await startSubscriber('News:5678');
    } catch (err) {
        console.error(err)
    }
}

initSubscribers()
    .catch(err => console.log(`${err}`));