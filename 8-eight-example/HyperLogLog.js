import {createClient} from "redis"

const client = createClient();

await client.connect();

const programmingLanguages = [
    "ElasticSearch", "Redis", "Docker", "Kubernetes"
]

const hyperLogLog = await client.PFADD('books', programmingLanguages);
console.log(`PFADD OPERATION ==> ${hyperLogLog}`);


const pfadd2 = await client.PFADD('books', 'ElasticSearch');
console.log(`PFADD OPERATION ==> ${pfadd2}`);


client
    .quit()
    .then(r => console.log(`${r}`))
    .catch(err => console.log(`${err}`));