import {createClient} from "redis";

const client = createClient();
client.on('error', err => console.log('Redis Client Error', err));
await client.connect();


function upVote(id) {
    let key = `article:${id}:votes`;
    client.incr(key)
        .then(r => {
            console.log(`upVote function Value of R: ${r}`);
        })
        .catch(err => console.log(`${err}`));
}

function downVote(id) {
    let key = `article:${id}:votes`;
    client.decr(key)
        .then(item => {
            console.log(`downVote function Value of R: ${item}`);
        })
        .catch(err => console.log(`${err}`));
}

function showResults(id) {
    let headlineKey = `article:${id}:headline`;
    let voteKey = `article:${id}:votes`;
    client.mGet([headlineKey, voteKey], function(err, replies) { // 1
        console.log('The article "' + replies[0] + '" has', replies[1], 'votes'); // 2
    })
        .then(item => {
            console.log(item)
        }).catch(err => {
        console.log(err)
    });
}

upVote(12345);
upVote(12345);
upVote(12345);
upVote(10001);
upVote(10001);
downVote(10001);
upVote(60056);
showResults(12345);
showResults(10001);
showResults(60056);
client.quit();