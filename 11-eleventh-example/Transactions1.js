import {createClient} from "redis";

const client = createClient();

await client.connect();

const result = await client
    .multi()
    .hSet("movie", {title: "The Godfather", star: 5})
    .hSet("movie", {title: "Shawshank Redemption", star: 5})
    .mSet("java community", "Turkiye Java Community", "AWS Community", "ServerlessTR")
    .incr("count")
    .exec();

console.log(`Transaction Result ==> ${result}`);