import {createClient} from "redis";

const client = createClient();

await client.connect();

/**
 * ZADD Method and FLAGS
 */
const cities = [
    {
        "score": 2020,
        "value": "Sarajevo"
    },
    {
        "score": 2022,
        "value": "Canakkale"
    },
    {
        "score": 2024,
        "value": "Istanbul"
    },
    {
        "score": 2030,
        "value": "Ankara"
    }
]

const addToSortedSet = await client.zAdd('cities', cities);
console.log(`Items added to Sorted Set`, addToSortedSet);

const updatedCity = {
    "score": 1923,
    "value": "Ankara"
}

// XX FLAG: Sorted Set icerisinde sadece eleman guncellemesi yapar. Yeni bir eleman eklemez.
const zAddWithXXFlag = await client.zAdd('cities', updatedCity, {XX: true});
console.log(`${zAddWithXXFlag}`);


//----------------------------------------


//NX FLAG: Sorted Set'e eleman eklemesi yapar. Eleman Guncellemesi yapmaz.

const newCity = {
    "score": 1940,
    "value": "Istanbul"
}

const zAddWithNXFlag = await client.zAdd('cities', newCity, {NX: true});
console.log(`${zAddWithNXFlag}`);




//LT FLAG: Eğer yeni gelen elemanın score'u var olan elemanın score'undan küçükse güncelleme yapar.
//Yeni değer eklenmesine engel değildir.

const update_LT_element = {
    "score": 2000,
    "value": "Sarajevo"
}

const zAddWithLTFlagUpdateElement = await client.zAdd('cities', update_LT_element, {LT: true});
console.log(`LT FLAGI calistirildi. => ${zAddWithLTFlagUpdateElement}`);

const add_LT_element = {
    "score": 1994,
    "value": "Hatay"
}

const zAddWithLTFlagAddElement = await client.zAdd('cities', add_LT_element, {LT: true});
console.log(`LT FLAGI calistirildi. => ${zAddWithLTFlagAddElement}`);


//GT FLAG: Eğer yeni gelen elemanın score'u var olan elemanın score'undan büyükse güncelleme yapar.
//Yeni değer eklenmesine engel değildir.

const update_GT_element = {
    "score": 2050,
    "value": "Ankara"
}

const zAddWithGtFlagUpdateElement = await client.zAdd('cities', update_GT_element, {GT: true});
console.log(`GT FLAGI calistirildi. => ${zAddWithGtFlagUpdateElement}`);

const add_GT_element = {
    "score": 35,
    "value": "Izmir" 
}

const zAddWithGtFlagAddElement = await client.zAdd('cities', add_GT_element, {GT: true});
console.log(`GT FLAGI calistirildi. => ${zAddWithGtFlagAddElement}`);

/**
 * ZRANGE Methodu
 */
const getWithZrange = await client.zRange('cities', 0, -1);
getWithZrange.forEach(item => console.log(`${item}`));


client
    .quit()
    .then(r => console.log(`${r}`))
    .catch(err => console.log(`${err}`));
