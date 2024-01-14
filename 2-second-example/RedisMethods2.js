import { createClient} from "redis";
const client = createClient();

await client.connect();

/**
 * INCR Methodu
 * @type {string}
 */
const value1 = await client.set("redis-essentials", 292);
console.log(`Value1 ==> ${value1}`);
const value2 = await client.INCR("redis-essentials");
console.log(`Value2 ==> ${value2}`);

const result1 = await client.get("redis-essentials");
console.log(`Result1 ==> ${result1}`);

//------------------------------------------------


const incrByValue1  = await client.set("spring-boot-in-action", "300");
console.log(`INCR_BY_VALUE==> ${incrByValue1}`);
const incrByResult1 = await client.incrBy("spring-boot-in-action", "57");
console.log(`INCR_BY_RESULT ==> ${incrByResult1}`);

client
    .quit()
    .then(r => console.log(`${r}`))
    .catch(err => console.log(`${err}`));



