import {createClient} from "redis";
const  subscriber = createClient();

const startSubscriber = async () => {

    await subscriber.connect();

    await subscriber.subscribe('Article:1234', message => {
        console.log(`Message ==> ${message}`);
    })

    console.log('Subscriber adsd kanalına abone oldu.');
}

startSubscriber()
    .catch(err => console.log(`If Err ==> ${err}`));