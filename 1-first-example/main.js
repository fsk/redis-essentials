/**
 * REDIS CONNECT
 * SET Method and Flags
 */

import { createClient } from 'redis';
const client = createClient();

await client.connect();

await client.set('mongodb', 'NoSQLDB');
const value1 = await client.get('mongodb');
console.log(value1);

await client.set('Redis', 'Redis Essentials', {EX: 5});
const value2 = await client.get('Redis');
console.log(value2);


const result = await client.set('Redis', 'Redis Essentials', {NX: true});
console.log(`RESULT => ${result}`);
const value3 = await client.get('Redis');
console.log(value3);

await client.set('springboot', 'Spring Boot in Practice');
const result2 = await client.set('springboot', 'Spring Boot in Action', {XX: true});
console.log(`RESULT2 => ${result2}`);

await client.set('docker', 'Docker in Action');
const value4 = await client.get('docker');
console.log(`VALUE4 => ${value4}`);
const result4 =  await client.set('docker', 'Docker in Practice', {GET: true});
console.log(`RESULT4 => ${result4}`);
console.log(await client.get('docker'));


await client.set('kubernetes', 'Kubernetes in Action', {EX: 15});
console.log(await client.get('kubernetes'));
await client.set('kubernetes', 'Kubernetes in Practice', {KEEPTTL: true});




client
    .quit()
    .then(r => console.log(`${r}`))
    .catch(err => console.log(`${err}`));

/**
 * /users/fsk/Documents/utils/redis-7.2.23/src/redis-cli
 */