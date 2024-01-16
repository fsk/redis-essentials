import {createClient} from "redis";

const client = createClient();

await client.connect();

/**
 *
 * HSET
 */
const setHashMovie = await client.hSet("movie", {title: "The Godfather"});
console.log(`Create HSET ==>  ${setHashMovie}`);


const setHashBook = await client.hSet("books",
    {
        book1: 'Clean Code', writer1: 'Robert C. Martin',
        book2: 'Refactoring', writer2: 'Martin Fowler',
    }
);
console.log(`Create Multiple HSET ==>  ${setHashBook}`);


const prices = await client.hSet("phones",
    {
        phone1: "iphone15", price1: 150,
        phone2: "samsung", price2: 130
    }
);

console.log(`Create Prices ==>  ${prices}`);

/**
 * HINCRBY
 */
const hIncrByPrice = await client.hIncrBy('phones', 'price1', 17);
console.log(`HINCRBY price iphone ==>  ${hIncrByPrice}`);


const hGetBooks = await client.hGet('books', 'book1');
console.log(`HGET From Books ==>  ${hGetBooks}`);

/**
 * HMGET
 */
const hmGetFieldArr = ['book1', 'writer1'];
const hmGetBooks = await client.hmGet('books', hmGetFieldArr);
console.log(`HMGET From Books ==>  ${hmGetBooks}`);


/**
 * HDEL
 */

const hDelFromPhone = await client.hDel('phones', 'phone1');
console.log(`HDEL From Phones ==>  ${hDelFromPhone}`);


/**
 * HGETALL
 */

const hGetAllFromBooks = await client.hGetAll('books');
console.log(JSON.stringify(hGetAllFromBooks, null, 2));



//await client.flushAll();

client
    .quit()
    .then(r => console.log(`${r}`))
    .catch(err => console.log(`${err}`));
