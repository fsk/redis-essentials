import {createClient} from "redis";

const client = createClient();

await client.connect();

/**
 * ZADD Method and FLAGS
 */
const cities = [
    {
        "score": 2020,
        "value": "Sarajevo"
    },
    {
        "score": 2022,
        "value": "Canakkale"
    },
    {
        "score": 2024,
        "value": "Istanbul"
    },
    {
        "score": 2030,
        "value": "Ankara"
    }
]

//const addToSortedSet = await client.zAdd('cities', cities);
//console.log(`Items added to Sorted Set`, addToSortedSet);

const city = {
    "score": 1923,
    "value": "Ankara"
}

// XX FLAG: Redis'e sadece eleman guncellemesi yapar. Yeni bir eleman eklemez.
const zAddWithNXFlag = await client.zAdd('cities', city, {XX: true})
console.log(`${zAddWithNXFlag}`);


/**
 * ZRANGE Methodu
 */

const getWithZrange = await client.zRange('cities', 0, -1);
getWithZrange.forEach(item => console.log(`${item}`));


client
    .quit()
    .then(r => console.log(`${r}`))
    .catch(err => console.log(`${err}`));
