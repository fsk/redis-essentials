import { createClient } from "redis";

const client = createClient();

await client.connect();

await client.set('programmingLanguage', 'Java');

const luaScript = 'return redis.call("GET", KEYS[1])';

try {
    // Redis anahtarının ismi string olarak geçirilmeli
    const result = await client.eval(luaScript, 1, 'programmingLanguage');
    console.log(result); // 'Java' değerini yazdırmalı
} catch (err) {
    console.error('Bir hata oluştu:', err);
}