import {createClient} from "redis"

const client = createClient();

await client.connect();

const setKey = await client.SET('book:devops', 'Docker in Action');
console.log(`SET KEY ==> ${setKey}`);

const getKey = await client.GET('book:devops');
console.log(`GET KEY ==> ${getKey}`);


/**
 * ## EXPIRE ##
 * ----------------
 * -> Key'e bir timeout ekler.
 * 
 * -> Bir key'in timeout'u yalnızca o key'i silen veya içeriğini yeni bir değerle değiştiren 
 * komutlar tarafından temizlenebilir. Örneğin; 
 * DEL komutu Key'i ve onun timeout'unu tamamen silerken, 
 * SET komutu Key'in değerini değiştirir ve varsa timeout'u sıfırlar.
 * 
 * -> INCR, LPUSH, HSET gibi komutlar Key'in sakladığı değeri değiştirir ama Key'in timeout değerini etkilemez. 
 * Bu işlemler Key'in değeri üzerinde değişiklik yapar ancak timeout'ı sıfırlamaz veya değiştirmez, 
 * bu yüzden Key'in süresi dolana kadar mevcut kalır.
 * 
 * -> PERSIST Komutu: Bir key üzerinde belirlenen timeout'u kaldırmak ve key'i kalıcı hale getirmek için 
 * PERSIST komutu kullanılır. Bu, Key'in otomatik olarak silinmesini önler.
 * 
 * -> RENAME İşlemi: Bir key RENAME ile yeniden adlandırıldığında, eski Key'in timeout süresi yeni Key'e aktarılır. 
 * Eğer RENAME işlemi sırasında bir key başka bir key'in üzerine yazılırsa, yeni key (üzerine yazılan) 
 * önceki key'in (yeniden adlandırılan) tüm özelliklerini, timeout dahil, miras alır.
 * 
 * -> EXPIRE ve EXPIREAT Kullanımı: EXPIRE veya PEXPIRE komutlarına sıfır veya negatif bir değer verildiğinde ya da 
 * EXPIREAT veya PEXPIREAT komutları geçmiş bir zamanla kullanıldığında, Redis ilgili key'i hemen siler. 
 * Bu durumda, Key'in süresi dolmuş olarak değil, silinmiş olarak kabul edilir ve ilgili olay 'del' olarak yayılır.
 */


const setExpire = await client.EXPIRE('book:devops', 100);
console.log(`SET EXPIRE OPERATION RESULT ==> ${setExpire}`);



const getTTL = await client.TTL('book:devops');
console.log(`TTL book:devops ==> ${getTTL}`);




client
    .quit()
    .then(r => console.log(`${r}`))
    .catch(err => console.log(`${err}`));