import {createClient} from "redis";

const client = createClient();

await client.connect();

const channel = process.argv[2];
const command = process.argv[3]; //Message


/**
 * -- PUBLISH --
 * Bir mesajı Redis kanalına gönderir ve bu mesajı alan client sayısını geri döndürür.
 * Gelen bir mesaj, o sırada kanala subscribe olmuş hiç client yoksa kaybolur.
 */
await client.publish(channel, command);

client
    .quit()
    .then(r => console.log(`${r}`))
    .catch(err => console.log(`${err}`));