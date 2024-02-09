import { createClient } from "redis"

const client = createClient();

await client.connect();


const programmingLanguages = [
    {
        "score": 200,
        "value": "Javascript"
    },
    {
        "score": 250,
        "value": "Java"
    },
    {
        "score": 100,
        "value": "CSharp"
    },
    {
        "score": 120,
        "value": "PHP"
    }
];


const keyName = 'ProgrammingLanguages';
//const addToSortedSet = await client.zAdd('ProgrammingLanguages', programmingLanguages);
//console.log(`Sorted Set add to elements ==> ${addToSortedSet}`);

/**
 * ZRANGE METHODU
 */
const zRangeMethod = await client.zRange(keyName, 0, -1);
zRangeMethod.forEach(item => console.log(`${item}`));


client
    .quit()
    .then(r => console.log(`${r}`))
    .catch(err => console.log(`${err}`));