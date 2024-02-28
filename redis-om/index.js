import {createClient} from "redis";
import {Repository, Schema, EntityId} from "redis-om";


const redis = createClient();


redis.on('error', (err) => console.log('Redis Client Error', err));
await redis.connect();


const albumSchema = new Schema('album', {
    artist: { type: 'string', field: 'album_artist' },
    title: { type: 'text', field: 'album_title'},
    year: { type: 'number', field: 'album_year' },
    genres: { type: 'string[]' },
    //songDurations: { type: 'number[]' },
    outOfPublication: { type: 'boolean' }
}, {
    dataStructure: 'HASH'
});

const studioSchema = new Schema('studio', {
    name: { type: 'string' },
    city: { type: 'string' },
    state: { type: 'string' },
    location: { type: 'point' },
    established: { type: 'date' }
}, {
    dataStructure: 'JSON'
});


const albumRepository = new Repository(albumSchema, redis);
const studioRepository = new Repository(studioSchema, redis);

let album = {
    artist: "Tarkan",
    title: "Megastar",
    year: 2010,
    genres: [ 'metal' ],
    //songDurations: [ 204, 290, 196, 210, 211, 105, 244, 245, 209, 252, 259, 200, 215, 219 ],
    outOfPublication: true
}

album = await albumRepository.save(album)
const result = album[EntityId];


const res = await albumRepository.fetch(result);
console.log("Result ==> ", res);

console.log("Entity Id ==> ", result)


await redis.quit()