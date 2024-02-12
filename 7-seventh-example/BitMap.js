import { createClient } from "redis";

const client = createClient();

await client.connect();


const date = new Date();

const day = date.getDay();
const month = date.getMonth() + 1;
const year = date.getFullYear();


const key = year + '-' + (month < 10 ? '0' + month : month) + '-' + (day < 10 ? '0' + day : day);

/**
 * SETBIT Method
 */
//const setBitOperation = await client.SETBIT(key, 10, 1);
//console.log(`SETBIT operation ==> ${setBitOperation}`);

/**
 * GETBIT Method
 */

//const getBitOperation = await client.GETBIT(key, 10);
//console.log(`GETBIT operation ==> ${getBitOperation}`);


/**
 * BITCOUNT Methodu
 */

const bitCountOperation = await client.BITCOUNT(key);
console.log(`BITCOUNT operation ==> ${bitCountOperation}`);



client
    .quit()
    .then(r => console.log(`${r}`))
    .catch(err => console.log(`${err}`));