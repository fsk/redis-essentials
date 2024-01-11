import { createClient } from "redis";

const client = createClient();

client.on('error', err => console.log('Redis Client Error', err));

async function connectRedis() {
    try {
        await client.connect();
        console.log('Connected to Redis');
    } catch (err) {
        console.error('Redis connection error:', err);
    }
}

async function markDealAsSent(dealId, userId) {
    try {
        const item = await client.sAdd(dealId, userId);
        console.log(item);
    } catch (err) {
        console.error("Error:", err);
    }
}

async function sendDealIfNotSent(dealId, userId) {
    try {
        const isMember = await client.sIsMember(dealId, userId);
        if (isMember) {
            console.log(`Deal ${dealId} was already sent to user ${userId}`);
        } else {
            console.log(`Sending ${dealId} to user ${userId}`);
            await markDealAsSent(dealId, userId);
        }
    } catch (err) {
        console.error(`Error => ${err}`);
    }
}

async function showUsersThatReceivedAllDeals(dealIds) {
    try {
        const users = await client.sInter(dealIds);
        console.log(`${users} received all of the deals: ${dealIds}`);
    } catch (err) {
        console.error(`Error => ${err}`);
    }
}

async function showUsersThatReceivedAtLeastOneOfTheDeals(dealIds) {
    try {
        const users = await client.sUnion(dealIds);
        console.log(`${users} received at least one of the deals: ${dealIds}`);
    } catch (err) {
        console.error(`Error => ${err}`);
    }
}

async function main() {
    await connectRedis();
    await markDealAsSent('deal:1', 'user:1');
    await markDealAsSent('deal:1', 'user:2');
    await markDealAsSent('deal:2', 'user:1');
    await markDealAsSent('deal:2', 'user:3');
    await sendDealIfNotSent('deal:1', 'user:1');
    await sendDealIfNotSent('deal:1', 'user:2');
    await sendDealIfNotSent('deal:1', 'user:3');
    await showUsersThatReceivedAllDeals(["deal:1", "deal:2"]);
    await showUsersThatReceivedAtLeastOneOfTheDeals(["deal:1", "deal:2"]);

    try {
        await client.quit();
        console.log("Disconnected from Redis");
    } catch (err) {
        console.error("Error disconnecting:", err);
    }
}

main()
    .then(r => {
        console.log(r)
    }).catch(err => {
    console.log(`Error : ${err}`)
});
