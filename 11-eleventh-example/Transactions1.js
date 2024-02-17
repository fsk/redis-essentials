import {createClient} from "redis";

const client = createClient();

await client.connect();

await client
    .multi()
    .hSet("")