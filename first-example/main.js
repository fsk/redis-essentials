/**
 * REDIS CONNECT
 */
import { createClient } from 'redis';
const client = createClient();
client.on('error', err => console.log('Redis Client Error', err));
await client.connect();
await client.set('first_key', 'Redis Essentials');
const value = await client.get('first_key');
console.log(value);
client.quit()