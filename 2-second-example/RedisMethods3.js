import { createClient} from "redis";
const client = createClient();
await client.connect();


// MGET Methodu
await client.set("writer1", "Uncle Bob");
await client.set("writer2", "Martin Fowler");
await client.set("writer3", "Josh Long");

const result1 = await client.mGet(["writer1", "writer2", "writer3"]);
console.log(result1);


//------------------------------------------------


//MSET Methodu
const keyValueArray = ['writer1', 'Uncle Bob', 'writer2', 'Josh Long', 'writer3', 'Martin Fowler'];
const result2 = await client.mSet(keyValueArray);
console.log(`RESULT 2 ==> ${result2}`);



client
    .quit()
    .then(r => console.log(`${r}`))
    .catch(err => console.log(`${err}`));

