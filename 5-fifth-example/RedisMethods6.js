import {createClient} from "redis";
const client = createClient();

await client.connect();

const addToSet = await client.sAdd('soccers', 'Fernando Muslera');
console.log(`Add To Set ==> ${addToSet}`);

const addToSetMultipleVal = await client.sAdd('soccers',
    ['Wesley Sneijder', 'Didier Drogba']);
console.log(`Add To Set Multiple Value ==> ${addToSetMultipleVal}`);

await client.sAdd('technicalbooks',
    [
        'Clean Code',
        'Clean Architecture',
        'Redis Essentials',
        'ElasticSearch in Action',
        'Effective Java'
    ]
);

await client.sAdd('backendbooks',
    [
        'Clean Architecture',
        'Effective Java',
        'Spring Boot in Practice',
        'Redis Essentials'
    ]
);

await client.sAdd('devopsbooks',
    [
        'Redis Essentials',
        'Clean Architecture',
        'ElasticSearch in Action'
    ]
);

const setArray = ['technicalbooks', 'backendbooks', 'devopsbooks']

const allSetsMemberBooks = await client.sInter(setArray);

console.log(`Set Intersection ==> ${allSetsMemberBooks}`);

/**
 * SDIFF
 */

const diffSets = await client.sDiff(['technicalbooks', 'backendbooks', 'devopsbooks']);
console.log(`Diff Set ==> ${diffSets}`);

/**
 * SUNION
 */

const booksArray = ['technicalbooks', 'backendbooks', 'devopsbooks'];
const sUnion = await client.sUnion(booksArray);
sUnion.forEach(item => console.log(item));


/**
 * SRANDMEMBER
 */

const programmingLanguagesArr = [
    'C', 'C#', 'C++', 'Java', 'Javascript', 'TypeScript', 'Go', 'Ruby', 'PHP', 'Python'
]

await client.sAdd('programminglanguages', programmingLanguagesArr);

const randomMember = await client.sRandMember('programminglanguages');
console.log(`Random Member ==> ${randomMember}`);

/**
 * SISMEMBER
 */

const isExistInSet = await client.sIsMember('programminglanguages', 'Go');
console.log(`Is Exist in Set ==> ${isExistInSet}`);


/**
 * SREM
 */

const deleteFromSet = await client.sRem('programminglanguages', 'C#');
console.log(`delete set ==> ${deleteFromSet}`);

/**
 * SCARD
 */

const setMemberCount = await client.sCard('programminglanguages');
console.log(`Member Count ==> ${setMemberCount}`);


/**
 * SMEMBERS
 */

const allMembers = await client.sMembers('programminglanguages');
allMembers.forEach(item => {
    console.log(item);
});

//await client.flushAll();

client
    .quit()
    .then(r => console.log(`${r}`))
    .catch(err => console.log(`${err}`));