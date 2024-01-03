import { createClient } from "redis";

const client = createClient();

client.on('error', (err) => console.log('Redis Client Error', err));

client.connect();

async function saveLink(id, author, title, link) {
    try {
        await client.hSet(`link:${id}`, {
            'author': author,
            'title': title,
            'link': link,
            'score': 0
        });
        console.log('Link saved successfully');
    } catch (err) {
        console.error('Error saving link', err);
    }
}

async function upVote(id) {
    try {
        await client.hIncrBy("link:" + id, "score", 1);
    } catch (err) {
        console.error('Error upvoting', err);
    }
}

async function downVote(id) {
    try {
        await client.hIncrBy("link:" + id, "score", -1);
    } catch (err) {
        console.error('Error downvoting', err);
    }
}

async function showDetails(id) {
    try {
        const replies = await client.hGetAll("link:" + id);
        console.log("Title:", replies['title']);
        console.log("Author:", replies['author']);
        console.log("Link:", replies['link']);
        console.log("Score:", replies['score']);
        console.log("--------------------------");
    } catch (err) {
        console.error('Error showing details', err);
    }
}

async function main() {
    await saveLink(123, "dayvson", "Maxwell Dayvson's Github page", "https://github.com/dayvson");
    await upVote(123);
    await upVote(123);
    await saveLink(456, "hltbra", "Hugo Tavares's Github page", "https://github.com/hltbra");
    await upVote(456);
    await upVote(456);
    await downVote(456);

    await showDetails(123);
    await showDetails(456);
    client.quit();
}

main();
