import {createClient} from "redis";

const client = createClient();

async function connectRedis() {
    try {
        await client.connect();
        console.log(`Connected to Redis`);
    } catch (err) {
        console.error(`Redis connection error: ${err}`);
    }
}

async function addItemToSortedSet(key, members) {
    try {
        const result = await client.zAdd(key, members);
        console.log(`Items added to Sorted Set '${key}':`, result);
    } catch (err) {
        console.error('Error adding items to Sorted Set:', err);
    }
}


async function main() {
    await connectRedis();
    const cities = [
        {
            "score": 2020,
            "value": "Sarajevo"
        },
        {
            "score": 2020,
            "value": "Canakkale"
        }
    ]
    await addItemToSortedSet('mySortedSet', cities, );

    try {
        await client.quit();
        console.log("Disconnected from Redis");
    } catch (err) {
        console.error("Error disconnecting:", err);
    }
}

main();