import {createClient} from "redis";

const client = createClient();

await client.connect();

/**
 * LPUSH METHODU
 */
const value1 = await client.lPush('books', 'Clean Code');
console.log(`VALUE1 ==> ${value1}`);

const value2 = await client.lPush('books', ['Redis Essentials', 'Refactoring']);
console.log(`VALUE2 ==> ${value2}`);

//------------------------------------------

/**
 * RPUSH METHODU
 */

const addSingleValue = await client.rPush('languages', 'Javascript');
console.log(`SINGLE VALUE ==> ${addSingleValue}`);
const addMultipleValue = await client.rPush('languages', ['Java', 'Python', 'C']);
console.log(`ADD MULTIPLE VALUE ==> ${addMultipleValue}`);

/**
 * LLEN METHODU
 */

const lengthFromRedisList = await client.lLen('languages');
console.log(`LENGTH FROM REDIS LIST LANGUAGES ==> ${lengthFromRedisList}`);

/**
 * LINDEX METHODU
 */

const lIndexZero = await client.lIndex('languages', 0);
console.log(`0. index ==> ${lIndexZero}`);

const lIndexPozitiveOne = await client.lIndex('languages', 1);
console.log(`1. index ==> ${lIndexPozitiveOne}`);

const lIndexNegativeOne = await client.lIndex('languages', -1);
console.log(`-1. index ==> ${lIndexNegativeOne}`);

const lIndexNegativeTwo = await client.lIndex('languages', -2);
console.log(`-2. index ==> ${lIndexNegativeTwo}`);


client
    .quit()
    .then(r => console.log(`${r}`))
    .catch(err => console.log(`${err}`));