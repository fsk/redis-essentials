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
<br>
<hr>
<br>

## <u>SET METHODU</u>
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
* <b><ins>`EXAT:`<ins></b> Timestamp cinsinden verinin rediste kalacağı süre (saniye cinsinden). Yani bunu şu şekilde düşünebiliriz.
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
> set kubernetes "kubernetes in action" EX 15
> get kubernetes
> set kubernetes "kubernetes in practice" KEEPTTL
>`````

<br>
<hr>
<br>

## <u>INCR METHODU</u>
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

## <u>INCRBY METHODU</u>
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

## <u>DECR , DECRBY , INCRBYFLOAT METHODLARI</u>
* DECR ve DECRBY methodları O(1) zamanda çalışır.
* DECR methodu ile DECRBY methodu INCR ve INCRBY methodlarının tam tersi olarak çalışır.
> <b>NOT:</b> Başlıktaki komutlar atomiktir.İki farklı client aynı anda aynı komutu çalıştıramaz ve aynı sonucu alamaz.
> Bu komutlarla ilgili race conditionlar oluşmaz. Race Condition iki farklı kaynağın aynı anda eş zamanlı olarak erişmeye
> çalıştığında oluşan bir problemdir. Redis, aynı anahtara eş zamanlı erişim durumlarında, sırayla ve tutarlı bir 
> şekilde komutları işler. Böylece, iki farklı client aynı anda aynı komutu çalıştıramaz ve aynı sonucu alamaz

<br>
<hr>
<br>

## <u>MGET , MSET METHODLARI</u>
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

<br>
<hr>
<br>

## <u>LISTS</u>
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

### LPUSH , RPUSH METHODLARI
* LPUSH methodu veriyi listenin başına ekler. STACK yapısını taklit etmek için kullanılır.
* Listeye ilk başta bir eleman eklenirse geriye 1 döner. Eğer başka bir eleman eklenirse bu sefer 2 döner. Aynı anda 3
eleman daha eklenirse 5 döner. Yani bu şekildeki her bir operasyondan sonra geriye listenin size'ını döner.
> <b>Node.js Syntax LPUSH Methodu</b>
> ````javascript
> const value1 = await client.lPush('books', 'Clean Code');
> console.log(`VALUE1 ==> ${value1}`);
> const value2 = await client.lPush('books', ['Redis Essentials', 'Refactoring']);
> console.log(`VALUE2 ==> ${value2}`);
> ````
> <b>Redis Syntax LPUSH Methodu</b>
> ````redis
> lpush bookList "spring-boot-in-action"
> lpush bookList "docker-in-action"
> lpush bookList "kubernetes-in-action" "redis-essentials"
> ````
<b>NOT:</b> İlk önce <i>spring-boot-in-action</i> değerini ekler. Sonrasında listenin başına 
<i>docker-in-action</i> değerini ekler.<br> 
<br>En sonunda liste <br>
1) redis-essentials<br>
2) kubernetes-in-action<br>
3) docker-in-action<br>
4) spring-boot-in-action<br>
<br>
şeklinde olur.

* RPUSH methodu veriyi listenin sonuna ekler. QUEUE Yapısını taklit etmek için kullanılır.
* Listeye ilk başta bir eleman eklenirse geriye 1 döner. Eğer başka bir eleman eklenirse bu sefer 2 döner. Aynı anda 3
eleman daha eklenirse 5 döner. Yani bu şekildeki her bir operasyondan sonra geriye listenin size'ını döner.

> <b>Node.js Syntaxı</b>
> ````javascript
> const addSingleValue = await client.rPush('languages', 'Javascript');
> console.log(`SINGLE VALUE ==> ${addSingleValue}`);
> const addMultipleValue = await client.rPush('languages', ['Java', 'Python', 'C']);
>console.log(`ADD MULTIPLE VALUE ==> ${addMultipleValue}`);
> ````
> <b>Redis Syntax RPUSH Methodu</b>
> ````redis
> rpush bookList "spring-boot-in-action"
> rpush bookList "docker-in-action"
> rpush bookList "kubernetes-in-action" "redis-essentials"
> ````
<b>NOT:</b> RPUSH methodunda hangi sırayla veri geldiyse o şekilde eklenir.<br>
Yani liste şu şekilde olur.<br>
1) Javascript
2) Java
3) Python
4) C

### LLEN METHODU
* Key'in sahip olduğu listenin uzunluğunu dönderir. Eğer key değeri mevcut değilse boş bir liste olarak yorumlanır ve 0
değerini geriye döner. Eğer key değerinin içerisindeki value bir liste değilse de hata döner.
* O(1) zamanda çalışır.
> <b>Node.js Syntax</b>
> ````javascript
> const lengthFromRedisList = await client.lLen('languages');
> console.log(`LENGTH FROM REDIS LIST LANGUAGES ==> ${lengthFromRedisList}`);
> ````
> <b>Redis Syntax</b>
> ````redis
> llen languages
> ````

### LINDEX METHODU
* Key'in sahip olduğu listedeki verilen değerin listedeki karşılığını döner. Her programlama dilinde olduğu gibi
redis'te de listeler 0.index'ten başlar.
* <b>ÇOK ÖNEMLİ NOT:</b> Redis'te 0. index ilk elemanı gösterirken -1. index son elemanı gösterir. Yani elimizde bir dizi
olduğunu kabul edelim. <br>
[17, 13, 2, 5, 3, 7]<br>
Bu dizinin 0. indexi 17'dir. 1. indexi 13'tür.
Ama aynı zamanda -1. indeksi 7'dir. -2. indexi 3'tür.

> <b>Node.js Syntax</b>
> ````javascript
> const lIndexZero = await client.lIndex('languages', 0);
> console.log(`0. index ==> ${lIndexZero}`);
> 
> const lIndexPozitiveOne = await client.lIndex('languages', 1);
> console.log(`1. index ==> ${lIndexPozitiveOne}`);
> 
> const lIndexNegativeOne = await client.lIndex('languages', -1);
> console.log(`-1. index ==> ${lIndexNegativeOne}`);
> 
> const lIndexNegativeTwo = await client.lIndex('languages', -2);
> console.log(`-2. index ==> ${lIndexNegativeTwo}`);
> ````
> <b>Redis Syntax</b>
> ````
> lindex languages -2
> lindex languages 0
> ````

### LRANGE METHODU
* Bu method key'in sahip olduğu liste'nin elemanlarını, parametre olarak verilen başlangıç indexi ve bitiş indeksine 
göre bir array olarak döndürür.
* <u><b>ÇOK ÖNEMLİ NOT:</b></u> Redis'te listelerde ilk eleman 0. indeksten başlar. Son eleman da -1. indeksten başlar.
İkinci eleman 1. index'tir. Sondan bir önceki eleman ise -2. indekstir.
* Bu method hata dönmez. yani range'ın dışında bir indis girildiği zaman hata alınmaz. Eğer methoda verilen 
başlangıç indeksi list'in size'ından büyükse boş bir array döner. Eğer stop parametresi daha büyükse redis son eleman gibi
davranır.
> <b>Node.js Syntax</b>
> ````javascript
> const lRangeArr = await client.lRange('languages', 1, -1);
> console.log(`Elements of Redis List wit lRange Method ==> ${lRangeArr}`);
> ````
> <b>Redis Syntax</b>
> ````redis
> lrange bookList 0 -1
> ````

### RPOP , LPOP
* RPOP methodu listenin en sonundaki elemanı siler ve geriye döner. Fakat optional olarak bir sayı verilirse de o kadar 
elemanı çıkarır ve geriye döner.
* Aynı şekilde LPOP methodu da listenin en başındaki elemanı siler ve geriye döner.
> <b>Node.js Syntax</b>
> ````javascript
> const rPop = await client.rPop('languages');
> console.log(`rPop Method ==> ${rPop}`);
> ````
> <b>Redis Syntax</b>
> ````redis
> rpop bookList
> ````

<br>
<hr>
<br>

## HASHES
* Hash'ler keyleri valueler ile eşleyebildiğimiz bir veri yapısıdır. Hem bellek kullanımını etkin bir şekilde optimize
ederler hem de verileri çok hızlı ararlar. Bir Hash'te hem alan adı hem de değer String'dir. Dolayısıyla, bir Hash, 
String'den String'e bir eşlemedir. 
* Hash'lerin bir diğer büyük avantajı bellek optimizasyonudur. Bu optimizasyon, 
<i>hash-max-ziplist-entries</i> ve <i>hash-max-ziplist-value</i> konfigürasyonlarına dayanır. 
İç yapısı itibarıyla, bir Hash ya bir <i>ziplist</i> ya da bir <i>hash table</i> olabilir. Bir ziplist, 
bellek açısından etkin olacak şekilde tasarlanmış çift yönlü bir linked list'tir. Bir ziplist'te, 
tamsayılar karakter dizisi yerine gerçek tamsayılar olarak saklanır. Bir ziplist bellek optimizasyonlarına sahip olsa da, 
aramalar sabit zamanda gerçekleştirilmez. Diğer taraftan, bir hash table sabit zamanda arama yapabilir ancak bellek açısından 
optimize edilmemiştir

### HSET METHODU
* Bir key değerine `Key-Value Pair` olacak şekilde veri ekler. Eğer key değeri varsa value'sinin üzerine yazar.
Eğer key değeri yoksa yeniden oluşturur. Eğer değer başarılı bir şekilde eklenirse 1 döner. Eğer ilgili key değeri varsa
(ki bu durumda key değeri sabit kalarak value değeri değişir) o zaman da 0 değeri döner.

> <b>Node.js Syntax</b>
> ````javascript
> const setHash = await client.hSet("movie", {title: "The Godfather"});
> console.log(`Create HSET ==>  ${setHash}`);
> ````
> <b>Redis Syntax</b>
> ````
> hset movie "title" "The Godfather"
> ````

### HMSET METHODU
* Normalde bu method ile bir map'e aynı anda birden fazla key value değeri eklemesi yapolabilirdi.
* Fakat bu method Redis 4.0'dan beri depreceted'dir. Bunun yerine yine HSET komutu kullanarak da aynı işlem yapılabilir.
> <b>Node.js Syntax</b>
> ````javascript
> const setHashBook = await client.hSet("books",
>    {
>        book1: 'Clean Code', writer1: 'Robert C. Martin',
>        book2: 'Refactoring', writer2: 'Martin Fowler',
>    }
> );
> ````
> <b>Redis Syntax</b>
> ````redis
> HSET books book3 'GRPC Go Microservice' writer3 'Huseyin Babal' book4 'Redis Essentials' writer4 'Hugo Lopes'
> ````

### HINCRBY , HINCRBYFLOAT , INCRBY , INCRBYFLOAT METHODLARI
* HINCRBY methodu bir Hset içerisindeki bir field'ın değerini verilen parametre kadar arttırır.
> <b>Node.js Syntax</b>
> ````javascript
> const prices = await client.hSet("phones",
>     {
>         phone1: "iphone15", price1: 150,
>         phone2: "samsung", price2: 130
>     }
> );
> 
> console.log(`Create Prices ==>  ${prices}`);
> 
> const hIncrByPrice = await client.hIncrBy('phones', 'price1', 17);
> console.log(`HINCRBY price iphone ==>  ${hIncrByPrice}`);
> ````
> <b>Redis Syntax</b>
> ````redis
> HSET notlar "matematik" 90 "Turkce" 70
> hincrby notlar "matematik" 10
> ````

* INCRBY methodu keyde saklanan sayıyı increment kadar artırır. Eğer key mevcut değilse, işlemi gerçekleştirmeden önce 
0 olarak ayarlanır. Key yanlış bir tipin değerini içeriyorsa veya bir tamsayı olarak temsil edilemeyen bir string 
içeriyorsa bir hata döndürülür. 
* Bu işlem 64 bit işaretli tamsayılarla sınırlıdır.
* HINCRBYFLOAT ve INCRBYFLOAT methodları da aslında bu methodları tam sayı değilde noktalı sayılar cinsinden yapılmasını
sağlar.

### HGET ,HMGET METHODLARI
* HGET methodu Redis key'inin içindeki key-value pairlerinden key'i verdiğimizde value'yi getirir.
* O(1)'de çalışır.
> <b>Node.js Syntax</b>
> ````javascript
> const hGetBooks = await client.hGet('books', 'book1');
> console.log(`HGET From Books ==>  ${hGetBooks}`);
> ````
> <b>Redis Syntax</b>
> ````redis
> hget books book1
> ````
* HMGET Methodu bir hash'deki birden fazla value değerini getirir.
* O(N)'de çalışır.
> <b>Node.js Syntax</b>
> ````javascript
> const hmGetFieldArr = ['book1', 'writer1'];
> const hmGetBooks = await client.hmGet('books', hmGetFieldArr);
> console.log(`HMGET From Books ==>  ${hmGetBooks}`);
> ````
> <b>Redis Syntax</b>
> ````redis
> hmget books writer1 book1
> ````

### HDEL METHODU
* Bir hash içerisindeki değeri siler.
* O(N)'de çalışır.
* Geriye Integer 1 döner. Eğer olmayan bir değer silinmeye çalışılırsa 0 döner.
> <b>Node.js Syntax</b>
> ````javascript
> const hDelFromPhone = await client.hDel('phones', 'phone1');
> console.log(`HDEL From Phones ==>  ${hDelFromPhone}`);
> ````
> <b>Redis Syntax</b>
> ````redis
> hdel books writer1 book1
> ````

### HGETALL METHODU
* Hash'deki bütün verileri getirir.
* O(N)' de çalışır.
> <b>Node.js Syntax</b>
> ````javascript
> const hGetAllFromBooks = await client.hGetAll('books');
> console.log(JSON.stringify(hGetAllFromBooks, null, 2));
> ````
> <b>Redis Syntax</b>
> ````redis
> hgetall books
> ````
* HGETALL komutu, bir Hash çok sayıda alan içeriyorsa ve çok fazla bellek kullanıyorsa bir problem olabilir. 
Tüm bu verilerin ağ üzerinden aktarılması gerektiği için Redis'i yavaşlatabilir. Böyle bir senaryoda iyi bir alternatif 
`HSCAN` komutudur. HSCAN, tüm alanları bir seferde döndürmez. Bir cursor ve Hash alanlarını değerleriyle birlikte 
parçalar halinde döndürür. Bir Hash'teki tüm alanları almak için döndürülen cursor 0 olana kadar HSCAN komutunun tekrar 
tekrar çalıştırılması gerekir.