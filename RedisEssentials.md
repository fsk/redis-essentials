# REDIS ESSENTIALS
* <b>Redis bir key-value data storage'dir.</b>
* <b>Redis Single Thread bir mimariye sahiptir.</b>
* <b>Redis tek bir CPU çekirdeğinde saniyede 500K tane SET ve Get işlemini gerçekleştirebiliyor.</b>
* <b>Redis single-thread olmasına rağmen çok hızlıdır çünkü arka tarafta Multiplexing IO teknolojisini kullanır.</b>

NodeJS'te bir Redis Client'i aşağıdaki gibi oluşturulabilir.
````javascript
import { createClient } from 'redis';
const client = createClient();

await client.connect();

await client.set('first_key', 'Redis Essentials');
const value = await client.get('first_key');

console.log(value);

client
    .quit()
    .then(r => console.log(`${r}`))
    .catch(err => console.log(`${err}`));
````

<hr>

## SET 
Bu komut ile Redis'e key value set edilebilir.<br>
> <b>NodeJS Syntax</b>
> ````javascript
> await client.set('first_key', 'Redis Essentials');
> ````
> <b>Redis Syntax</b>
> ````redis
> set keyName "valueName"
>````

### SET METHODU FLAG'LERİ
* <b><ins>`EX:`</ins></b> Second cinsinden verinin rediste kalacağı süre

> <b>NodeJS Syntax</b>
> ````javascript
> await client.set('first_key', 'Redis Essentials', {EX: 5});
>````
> <b>Redis Syntax</b>
> ````redis
> set springboot "Spring Boot in Action" EX 15
> ````

* <b><ins>`PX:`</ins></b> Milisecond cinsinden verinin rediste kalacağı süre.
<br><br>
* <ins>`EXAT:`<ins> Timestamp cinsinden verinin rediste kalacağı süre (saniye cinsinden). Yani bunu şu şekilde düşünebiliriz.
Bir veri rediste 300 sn kalacaksa, ve o anki epoch time 1650000000 ise biz bunu EXAT kullanıyorsak
1650000300 yapmalıyız.
<br><br>
* <b><ins>`PXAT:`</ins></b> Timestamp cinsinden verinin rediste kalacağı süre. (milisaniye cinsinden)
<br><br>
* <b><ins>`NX:`</ins></b> Key değeri yalnızca rediste halihazırda yoksa yeni bir değer tanımlamamıza olanak tanır.
Eğer aynı değerden varsa NİL döner.
> <b>NodeJS Syntax</b>
> ````javascript
> const result = await client.set('Redis', 'Redis Essentials', {NX: true});
> console.log(`RESULT => ${result}`);
> const value = await client.get('Redis');
> console.log(value);
> ````
> <b>Redis Syntax</b>
> ````redis
> set springboot "Spring Boot in Action"
> get springboot
> set springboot "Spring Boot in Action" NX
> ````
* <b><ins>`XX:`</ins></b> Key değeri yalnızca rediste halihazırda varsa yeni bir değer tanımlamamıza olanak tanır.
> <b>NodeJS Syntax</b>
> ````javascript
> await client.set('springboot', 'Spring Boot in Practice');
> const result2 = await client.set('springboot', 'Spring Boot in Action', {XX: true});
> console.log(`RESULT2 => ${result2}`);
> ````
> <b>Redis Syntax</b>
> ````redis
> set springboot "Spring Boot in Practice"
> get springboot
> set springboot "Spring Boot in Action" XX
> ````
> <i><b>Çok Önemli Not</i></b>: XX değeri aynı key değerinden varsa o key değerini yeniden ayarlar. Yoksa NİL döner.
<br><br>
* <b><ins>`GET:`</ins></b> Redis'te GET flag'ı SET komutuyla birlikte kullanıldığında, anahtarın eski değerini döndürürken aynı anda 
yeni bir değer atamanıza olanak tanır. Bu, "get-and-set" işlemi olarak bilinir ve atomik bir işlemdir, 
yani iki işlem (değer almak ve değer atamak) birbirinden ayrılmaz ve ardışık olarak gerçekleşir.
> <b>NodeJS Syntax</b>
> ````javascript
> await client.set('docker', 'Docker in Action');
> const value4 = await client.get('docker');
> console.log(`VALUE4 => ${value4}`);
> const result4 =  await client.set('docker', 'Docker in Practice', {GET: true});
> console.log(`RESULT4 => ${result4}`);
> console.log(await client.get('docker'));
> ````
> <b>Not:</b> İlk satırda "docker" key'ine "docker in action" değerini yazar. Sonrasındaki set methodundan sonra tekrar 
>docker in action değerini yazar ama en son satırda docker in practice yazar.
> <br><br>
> <b>Redis Syntax</b>
> ````redis
> set docker "docker in action"
> get docker
> SET docker "docker in practice" GET
> get docker
> ````
> <b>Not:</b> 3. satırdaki komut geriye "docker in action" değerini döner ama bir aşağı satırdaki get docker
komutundan "Docker in practice" değerini getirir.
* <b><ins>`KEEPTTL:`</ins></b> Redis'te EX ile TTL verdiğimiz bir değeri güncellediğimizde bu flag'le birlikte
güncellediğimiz değerin de TTL değeri aynen korunur.
> <b>NodeJS Syntax</b>
> ````javascript
> await client.set('kubernetes', 'Kubernetes in Action', {EX: 15});
> console.log(await client.get('kubernetes'));
> await client.set('kubernetes', 'Kubernetes in Practice', {KEEPTTL: true});
> ````
> <b>Redis Syntax</b>
>`````redis
>set kubernetes "kubernetes in action" EX 15
> get kubernetes
> set kubernetes "kubernetes in practice" KEEPTTL
>`````

<hr>

## INCR
* O(1) Zamanda çalışır.
* Bir key değerini 1 arttırır. Arttırılmış değeri geriye döner. Eğer key değeri String'e dönüştürülemeyen
ya da yanlış bir değer içeriyorsa hata döner.
* Redis sayıları int olarak ya da başka bir sayı formatında saklamaz. Sayılar redis'e eklenirken String
formatında saklanır. İşlem yapılacağı zaman tekrar int'e çevrilir.
* INCR methodu ile kullanılan bir key değeri yoksa bu key değerini önce rediste oluşturur.
Sonra bu key'in value değerini 0 olarak ayarlar. Akabinde, bu value değerini 1 arttır ve geriye bu arttırılmış
değeri döner. Yani olmayan bir key değeri ile INCR methodunu kullandığımızda ekranda 1 değerini görürüz.
* INCR methodu yalnızca 64 bitlik işaretli tamsayılarla çalışır.

> <b>NodeJS Syntax</b>
> ````javascript
> const value1 = await client.set("redis-essentials", 292);
> console.log(`Value1 ==> ${value1}`);
> const value2 = await client.INCR("redis-essentials");
> console.log(`Value2 ==> ${value2}`);
> ````
> <b>Redis Syntax</b>
>````redis
> SET counter "100"
> INCR counter
> ````

## INCRBY
* O(1) Zamanda çalışır.
* Bir key değerini verilen sayı kadar arttırır ve yeni değeri geriye döner.
* Redis sayıları int olarak ya da başka bir sayı formatında saklamaz. Sayılar redis'e eklenirken String
  formatında saklanır. İşlem yapılacağı zaman tekrar int'e çevrilir.
* INCR methodu ile kullanılan bir key değeri yoksa bu key değerini önce rediste oluşturur.
  Sonra bu key'in value değerini 0 olarak ayarlar. Akabinde, bu value değerini 1 arttır ve geriye bu arttırılmış
  değeri döner. Yani olmayan bir key değeri ile INCR methodunu kullandığımızda ekranda 1 değerini görürüz.

> <b>NodeJS Syntax</b>
> ````javascript
> const incrByValue1  = await client.set("spring-boot-in-action", "300");
> console.log(`INCR_BY_VALUE==> ${incrByValue1}`);
> const incrByResult1 = await client.incrBy("spring-boot-in-action", "57");
> console.log(`INCR_BY_RESULT ==> ${incrByResult1}`);
> ````
> <b>Redis Syntax</b>
> ````redis
> set number 2
> incrby number 7
> ````

## DECR , DECRBY , INCRBYFLOAT
* DECR ve DECRBY methodları O(1) zamanda çalışır.
* DECR methodu ile DECRBY methodu INCR ve INCRBY methodlarının tam tersi olarak çalışır.
> <b>NOT:</b> Başlıktaki komutlar atomiktir.İki farklı client aynı anda aynı komutu çalıştıramaz ve aynı sonucu alamaz.
> Bu komutlarla ilgili race conditionlar oluşmaz. Race Condition iki farklı kaynağın aynı anda eş zamanlı olarak erişmeye
> çalıştığında oluşan bir problemdir. Redis, aynı anahtara eş zamanlı erişim durumlarında, sırayla ve tutarlı bir 
> şekilde komutları işler. Böylece, iki farklı client aynı anda aynı komutu çalıştıramaz ve aynı sonucu alamaz


<hr>

## MGET , MSET
* MGET methodu aynı anda birden fazla key değerinin value'lerini bir <i>liste</i> olarak döndürür. Olmayan bir değer varsa
<i>nil</i> olarak döndürür.
* O(N)'de çalışır.
> <b>Node.js Syntax MGET Methodu</b>
> ````javascript
> await client.set("writer1", "Uncle Bob");
> await client.set("writer2", "Martin Fowler");
> await client.set("writer3", "Josh Long");
> const result1 = await client.mGet(["writer1", "writer2", "writer3"]);
> console.log(result1);
> ````
> <b>Redis Syntax MGET Methodu</b>
> ````redis
> mget writer1 writer2 writer3
> ````
* MSET methodu aynı anda birden fazla key değeri set etmemizi sağlar.
* O(N)'de çalışır.
* Atomik bir işlemdir.
* Mevcut değerleri yeni değerleriyle değiştirir.
> <b>Node.js Syntax MSET Methodu</b>
> ````javascript
> const keyValueArray = ['writer1', 'Uncle Bob', 'writer2', 'Josh Long', 'writer3', 'Martin Fowler'];
> const result2 = await client.mSet(keyValueArray);
> console.log(`RESULT 2 ==> ${result2}`);
> ````
> <b>Redis Synrax MGET Methodu</b>
> ````redis
> MSET key1 "Hello" key2 "World"
> ````

<b>NOT:</b> MSET komutu eğer redis'te bir key değeri varsa onun üzerine yeni value değerini yazar.
Eğer bu durum olsun istenmiyorsa <b><i>MSETNX</i></b> methodu kullanılabilir.

<hr>

## LISTS
* Listeler Redis'te oldukça esnek bir yapıya sahiptir. Çünkü listeler basit bir collection gibi, stack gibi ya
queue gibi çalışabilirler.
* Redis'teki Listeler birer linked list(bağlı liste)dir. Bu yüzden liste'nin başından ya da sonundan eleman eklemeler
sabit zamanda O(1)'de gerçekleşir.
* Redis'teki bir listenin bir elemanına erişmek O(N)'de yani lineer zamanda gerçekleşir. Bu şu demek. Bir listenin boyutu
ne kadar büyürse bir elemana ulaşmak o kadar uzar. Ama liste'nin boyutu ne olursa olsun ilk ve son elemanlara erişmek
her zaman için O(1)'de yani sabit zamanda gerçekleşir.
* Bir liste'nin tutabileceği maksimum eleman sayısı 2^32 - 1 kadardır.
* Redis'teki listeler LIFO ve FIFO mantığıyla çalışırlar.
* Redis listeleri, eşzamanlı sistemlerde bile elemanların kuyrukta çakışma olmadan çıkarılmasını sağlar. Liste 
komutlarının otomatik olması, bir işlemin tamamen gerçekleşeceğini ya da hiç gerçekleşmeyeceğini garanti eder.

### LPUSH , RPUSH
* LPUSH methodu veriyi listenin başına ekler. STACK yapısını taklit etmek için kullanılır.
````redis
lpush bookList "spring-boot-in-action"
lpush bookList "docker-in-action"
lpush bookList "kubernetes-in-action", "redis-essentials"
````
