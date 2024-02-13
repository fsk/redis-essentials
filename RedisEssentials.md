# REDIS ESSENTIALS
* <b>Redis bir key-value data storage'dir.</b>
* <b>Redis Single Thread bir mimariye sahiptir.</b>
* <b>Redis tek bir CPU çekirdeğinde saniyede 500K tane SET ve Get işlemini gerçekleştirebiliyor.</b>
* <b>Redis single-thread olmasına rağmen çok hızlıdır çünkü arka tarafta Multiplexing IO teknolojisini kullanır.</b>


## Redis'i başlatmak için
* Redis'i başlatmak için öncelikle redisin kurulu olduğu klasöre gidilir.
* src klasörünün altına girdikten sonra, bu dosya yolunda, terminal ekranda, `./redis-server` komutu çalıştırılır.
* Bu komut çalıştırıldıktan sonra bu tab'ı kapatmadan, aynı dosya yolunda farklı bir terminal tabı açılarak `./redis-cli`komutu çalıştırılır. 

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

<br>
<hr>
<br>

## SET
* Redis'te bir Set, tekrarlanana elemanların eklenemeyeceği farklı String'lerin sırasız bir collectionudur.
* Bir Set hash table olarak uygulanmıştır. Bu da aslında bazı işlerin daha da optimize edilmesine olanak sağlamıştır.
* Eleman ekleme, eleman silme ve arama işlemleri sabit zamanda(constant time) yani O(1)'de gerçekleşir.
* Bir Set'in tutabileceği maksimum eleman sayısı 2^32-1'dir, bu da Set başına 4 milyardan fazla eleman olabileceği 
anlamına gelir.
* Eğer Set içindeki tüm elemanlar tamsayı ise, bellek kullanımı daha verimli hale gelir. 
* <i>Set-Max-Intset-Entries Konfigürasyonu:</i> Bu konfigürasyon, Set içindeki tamsayı elemanların maksimum sayısını belirler. 
Bu değer, Set'in nasıl saklandığını ve ne kadar bellek kullandığını etkileyebilir.

### SADD METHODU
* Bir veya daha fazla elemanı Set'e ekler.
* Eğer bir eleman ekleyeceksek O(1)'de çalışır. Eğer birden fazla eleman ekleyeceksek O(N)'de çalışır.
* Bir eleman eklenirse geriye integer 1 döner, N tane eleman ekleyeceksek geriye N döner.
* Eğer eklenen değer daha önceden Set içerisinde var ise geriye integer 0 döner.
> <b>Node.js Syntax</b>
> ````javascript
> const addToSet = await client.sAdd('soccers', 'Fernando Muslera');
> console.log(`Add To Set ==> ${addToSet}`);
> 
> const addToSetMultipleVal = await client.sAdd('soccers', ['Wesley Sneijder', 'Didier Drogba']);
> console.log(`Add To Set Multiple Value ==> ${addToSetMultipleVal}`);
> ````
> <b>Redis Syntax</b>
> ````redis
> sadd soccers 'Felipe Melo'
> sadd soccers 'Selcuk Inan' 'Torreira' 'Icardi'
> ````

### SINTER METHODU
* Bir veya daha fazla Set'i parametre olarak bekler.
* Eğer bir Set parametre verilirse, ilgili Set'in içerisindeki elemanlar array olarak döner.
* Eğer birden fazla Set parametre olarak verilirse, bu Set'lerdeki elemanlardan ortak olanlar geriye döner.
> <b>Node.js Syntax</b>
> ````javascript
> await client.sAdd('technicalbooks',
>     [
>         'Clean Code',
>         'Clean Architecture',
>         'Redis Essentials',
>         'ElasticSearch in Action',
>         'Effective Java'
>     ]
> );
> 
> await client.sAdd('backendbooks',
>     [
>         'Clean Architecture',
>         'Effective Java',
>         'Spring Boot in Practice',
>         'Redis Essentials'
>     ]
> );
> 
> await client.sAdd('devopsbooks',
>     [
>          'Redis Essentials',
>          'Clean Architecture',
>          'ElasticSearch in Action'
>     ]
> );
> 
> const setArray = ['technicalbooks', 'backendbooks', 'devopsbooks']
> const allSetsMemberBooks = await client.sInter(setArray);
> 
> console.log(`Set Intersection ==> ${allSetsMemberBooks}`);
> ````
> <b>Redis Syntax</b>
> ````redis
> sadd technicalbooks 'Clean Code' 'Clean Architecture' 'Redis Essentials' 'ElasticSearch in Action' 'Effective Java'
> sadd backendbooks 'Clean Architecture' 'Effective Java' 'Spring Boot in Practice' 'Redis Essentials'
> sadd devopsbooks 'Redis Essentials' 'Clean Architecture' 'ElasticSearch in Action' 'Redis Essentials'
> 
> sinter technicalbooks
> 
> sinter technicalbooks backendbooks devopsbooks
> ````

### SDIFF METHODU
* Bir veya birden fazla Set'i parametre olarak bekler.
* Bu komut ilk Set'te bulunan, ancak takip eden Set'lerde bulunmayan tüm ögeleri içeren bir array döndürür.
* Bu komutta key'lerin sırası önemlidir. Var olmayan herhangi bir key, boş bir set olarak kabul edilir.
> <b>Node.js Syntax</b>
> ````javascript
> await client.sAdd('technicalbooks',
>     [
>         'Clean Code',
>         'Clean Architecture',
>         'Redis Essentials',
>         'ElasticSearch in Action',
>         'Effective Java'
>     ]
> );
> 
> await client.sAdd('backendbooks',
>     [
>          'Clean Architecture',
>          'Effective Java',
>          'Spring Boot in Practice',
>          'Redis Essentials'
>     ]
> );
> 
> await client.sAdd('devopsbooks',
>     [
>          'Redis Essentials',
>          'Clean Architecture',
>          'ElasticSearch in Action'
>     ]
> );
> ````
> <b>Redis Syntax</b>
> ````redis
> sdiff technicalbooks backendbooks
> ````

### SUNION METHODU
* Parametre olarak verilen Set'lerdeki verilerin tamamını birleştirir ve geriye bir array dönderir.
* Aynı değerlerden birden fazla olursa o değerleri tekler.
* O(N)'de çalışır.
> <b>Node.js Syntax</b>
> ````javascript
> const booksArray = ['technicalbooks', 'backendbooks', 'devopsbooks'];
> const sUnion = await client.sUnion(booksArray);
> sUnion.forEach(item => console.log(item));
> ````
> <b>Redis Syntax</b>
> ````redis
> sunion technicalbooks backendbooks devopsbooks
> ````

### SRANDMEMBER
* Bir Set'ten rastgele bir üye döndürür. Set'ler unordered(sırasız) olduğu için belirli bir pozisyondan elemanları almak
mümkün değildir.
* Pozitive ne Negative değerler alabilir.
* Eğer count argümanı pozitif bir sayı olarak verilirse, Set içinden benzersiz elemanlar içeren bir dizi döndürülür.
Bu dizi, ya belirtilen count sayısı kadar eleman içerir ya da Set'in toplam eleman sayısına (kardinalitesine) eşit olur;
hangisi daha azsa o kadar eleman içerir.
* Eğer count argümanı negatif bir sayı olarak verilirse, komutun davranışı değişir ve aynı elemanın birden fazla kez 
döndürülmesine izin verilir. Bu durumda, döndürülen eleman sayısı, count argümanının mutlak değeri kadardır.
> <b>Node.js Syntax</b>
> ````javascript
> const programmingLanguagesArr = [
>     'C', 'C#', 'C++', 'Java', 'Javascript', 'TypeScript', 'Go', 'Ruby', 'PHP', 'Python'
> ]
> 
> await client.sAdd('programminglanguages', programmingLanguagesArr);
> 
> const randomMember = await client.sRandMember('programminglanguages');
> console.log(`Random Member ==> ${randomMember}`);
> //Not: Yukarıdaki kod her çalıştığında console'da farklı bir değer göreceğiz.
> ````
> <b>Redis Syntax</b>
> ````redis
> srandmember programminglanguages
> ````
### SISMEMBER METHODU
* Bir Set içerisinde bir değer var mı yok mu onu kontrol eder.
* Eğer değer varsa geriye integer 1 döner, eğer değer yoksa integer 0 döner.
* O(1)'de çalışır.
> <b>Node.js Syntax</b>
> ````javascript
> const isExistInSet = await client.sIsMember('programminglanguages', 'Go');
> console.log(`Is Exist in Set ==> ${isExistInSet}`);
> //Not: Bu kod node.js tarafında true/false döner.
> ````
> <b>Redis Syntax</b>
> ````redis
> sismember programminglanguages 'Go'
> //NOT: Bu kod Intellijn db konsolunda çalıştığında true/false döner ama Redis-Cli da çalıştığında 0/1 döner.
> ````

### SREM METHODU
* Set'ten değer siler ve değeri geriye döner.
* Eğer key değeri yoksa empty set gibi davranır ve geriye 0 döner.
* Set'in üyesi olmayan bir değer verildiğinde bunu gözardı (ignore) eder.
* Bir veya daha fazla eleman aynı anda silinebilir.
* Bir eleman silinecekse O(1)'de çalışılır. N eleman çıkarılacaksa O(N)'de çalışır.
> <b>Node.js Syntax</b>
> ````javascript
> const deleteFromSet = await client.sRem('programminglanguages', 'C#');
> console.log(`delete set ==> ${deleteFromSet}`);
> ````
> <b>Redis Syntax</b>
> ````redis
> srem programminglanguages 'Python'
> ````
> <b>Not:</b> Bu kodlar intellij'de çalıştırıldığında geriye integer 1 döner ama redis-cli'da çalıştırıldığı zaman
> geriye ilgili değerin kendisi döner.

### SCARD METHODU
* Key değeri verilen Set'in eleman sayısını geriye dönderir.
* O(1)'de çalışır.
> <b>Node.js Syntax</b>
> ````javascript
> const setMemberCount = await client.sCard('programminglanguages');
> console.log(`Member Count ==> ${setMemberCount}`);
> ````
> <b>Redis Syntax</b>
> ````redis
> scard programminglanguages
> ````

### SMEMBERS METHODU
* Parametre olarak verilen Set'teki elemanları geriye dönderir.
* Eğer SINTER Methodu'da tek parametre ile çalıştırılırsa aynı etkiyi yapar.
> <b>Node.js Syntax</b>
> ````javascript
>  const allMembers = await client.sMembers('programminglanguages');
>  allMembers.forEach(item => {
>        console.log(item);
>  });
> ````
> <b>Redis Syntax</b>
> ````redis
> smembers programminglanguages
> ````
<hr>

## SORTED SET
* Rediste sorted set'ler aslında set yapılarına çok benzerdir.
* Redis Sorted Set'ler ilişkişli bir puana göre sıralanan, benzersiz String üyelerden oluşan bir collectiondur.
* Eğer aynı score'a sahip birden fazla üye varsa, bu sefer alfabetik olarak sıralanır.
* Sorted Set'ler Set'in ve Hash'in karışımı olarak düşünülebilir.

### ZADD METHODU
* Bir sorted set'e eleman ekler.
* Belirtilen key'de saklanan sorted set'e, belirtilen score'larla tüm belirtilen üyeler eklenir. 
* Birden fazla score/member çifti belirtmek mümkündür. 
* Belirtilen bir üye zaten sorted set'in bir üyesiyse, score güncellenir ve eleman doğru sıralamayı sağlamak için doğru pozisyona tekrar yerleştirilir.
* Eğer key mevcut değilse, belirtilen üyelerle yeni bir sorted set oluşturulur, sanki sorted set boşmuş gibi. Eğer key mevcutsa ama bir sorted set içermiyorsa, bir hata döndürülür.
> <b>Node.js Syntax</b>
> ````javascript
>const cities = [
>    {
>        "score": 2020,
>        "value": "Sarajevo"
>    },
>    {
>        "score": 2020,
>        "value": "Canakkale"
>    }
>]
>
>const addToSortedSet = await client.zAdd('mySortedSet', cities);
> ````
> <b>Redis Syntax</b>
> ````redis
> zadd mySortedSet 2024 "Ankara"
> ````

### ZADD METHODU FLAG'LERİ
* <b><ins>`XX:`</ins></b> Sadece zaten mevcut olan elemanların güncellenmesini sağlar. Yeni bir eleman eklemez.

> <b>Node.js Syntax</b>
> ````javascript
>const city = {
>    "score": 1923,
>    "value": "Ankara"
>}
>const zAddWithNXFlag = await client.zAdd('cities', city, {XX: true})
>console.log(`${zAddWithNXFlag}`);
> ````
> <b>Redis Syntax</b>
> ````redis
> zadd cities XX 1905 "Ankara"
> ````

* <b><ins>`NX:`</ins></b> Sadece yeni bir eleman ekler. Var olan bir elemanı güncellemez.

> <b>Node.js Syntax</b>
>````javascript
>const newCity = {
>    "score": 1940,
>    "value": "Istanbul"
>}
>const zAddWithNXFlag = await client.zAdd('cities', newCity, {NX: true});
>console.log(`${zAddWithNXFlag}`);
>````
> <b>Redis Syntax</b>
> ````redis
> zadd cities NX 1994 Hatay
> ````

* <b><ins>`LT:`</ins></b> Gelen yeni score eğer elemanın score'undan daha küçükse güncelleme yapar.
Yoksa güncelleme yapmaz. Yeni eleman eklenmesine engel değildir. Yani gelen değer, eğer ilgili sorted
set'te gelen eleman yoksa bu değeri ekler.
> <b>Node.js Syntax</b>
> ````javascript
> const update_LT_element = {
>     "score": 2000,
>     "value": "Sarajevo"
> }
> 
> const zAddWithLTFlagUpdateElement = await client.zAdd('cities', update_LT_element, {LT: true});
> console.log(`LT FLAGI calistirildi. => ${zAddWithLTFlagUpdateElement}`);
> 
> const add_LT_element = {
>     "score": 1994,
>     "value": "Hatay"
> }
> 
> const zAddWithLTFlagAddElement = await client.zAdd('cities', add_LT_element, {LT: true});
> console.log(`LT FLAGI calistirildi. => ${zAddWithLTFlagAddElement}`);
> ````
> <b>Redis Syntax</b>
> ````redis
> zadd cities LT 140 "Ankara"
> ````

* <b><ins>`GT:`</ins></b> Gelen yeni score eğer elemanın score'undan daha büyükse güncelleme yapar.
Yoksa güncelleme yapmaz. Yeni eleman eklenmesine engel değildir. Yani gelen değer, eğer ilgili sorted
set'te gelen eleman yoksa bu değeri ekler.
> <b>Node.js Syntax</b>
> ````javascript
> const update_GT_element = {
>     "score": 2050,
>     "value": "Ankara"
> }
> 
> const zAddWithGtFlagUpdateElement = await client.zAdd('cities', update_GT_element, {GT: true});
> console.log(`GT FLAGI calistirildi. => ${zAddWithGtFlagUpdateElement}`);
> 
> const add_GT_element = {
>     "score": 35,
>     "value": "Izmir" 
> }
> 
> const zAddWithGtFlagAddElement = await client.zAdd('cities', add_GT_element, {GT: true});
> console.log(`GT FLAGI calistirildi. => ${zAddWithGtFlagAddElement}`);
> ````
> <b>Redis Syntax</b>
> ````redis
> zadd cities GT 140 "Ankara"
> ````

* <b><ins>`CH:`</ins></b> Redis'in ZADD komutunda CH (changed - değişen) bayrağı, komutun dönüş
 değerinin davranışını değiştirir. Normalde ZADD komutunun dönüş değeri, sıralı sete eklenen yeni elemanların sayısını verir. 
 Ancak CH bayrağı eklenirse, dönüş değeri yalnızca yeni eklenen elemanların sayısını değil, aynı zamanda puanı 
 güncellenen mevcut elemanların sayısını da içerecek şekilde genişletilir.

 <hr>

### ZRANGE METHODU
* Belirli bir <key>'de saklanan sıralı setteki belirtilen aralıktaki elemanları döndürür.
* ZRANGE, farklı türde aralık sorguları gerçekleştirebilir: indekse (sıralama) göre, puana göre veya alfabetik sıraya göre.
* ZRANGE methodu normal defaultta score puanlarına göre sıralı getirir. Aynı puana sahip olan değerler
alfabetik sıraya göre düzelir.
* Opsiyonel <b><i>REV</i></b> argümanı, sıralamayı tersine çevirir; böylece elemanlar en yüksek 
puandan en düşük puana doğru sıralanır ve aynı puana sahip elemanlar arasındaki bağlar ters alfabetik 
sıralama ile çözülür.
* Opsiyonel <b><i>LIMIT</i></b> argümanı, eşleşen elemanlardan bir alt aralık elde etmek için kullanılabilir (SQL'deki SELECT LIMIT offset, count'a benzer).
* Opsiyonel <b><i>WITHSCORES</i></b> argümanı, komutun yanıtına döndürülen elemanların puanlarını ekler.

<u><b>ZRANGE METHODU ARGUMANLARI KULLANIMI</b></u>
* <b><ins>`REV ARGUMANI:`</ins></b>
> <b>Node.js Syntax</b>
> ````javascript
> // Asagidaki json'un Redis'te 'ProgrammingLanguages' adlı bir key'de tutulduğunu düşünelim.
> const programmingLanguages = [
>    {
>        "score": 200,
>        "value": "Javascript"
>    },
>    {
>        "score": 250,
>        "value": "Java"
>    },
>    {
>        "score": 100,
>        "value": "CSharp"
>    },
>    {
>        "score": 120,
>        "value": "PHP"
>    }
> ];
> const keyName = 'ProgrammingLanguages';
> const zRangeMethod = await client.zRange(keyName, 0, -1);
> zRangeMethod.forEach(item => console.log(`${item}`));
> ````
>
> <b>Redis Syntax</b>
> ````redis
> range ProgrammingLanguages 0 -1
> ````

* <b><ins>`LIMIT ARGUMANI:`</ins></b> Eşleşen elemanlardan bir alt aralık elde etmek için kullanışlıdır. 
Özellikle büyük veri setleriyle çalışırken, belirli bir aralıktaki elemanları sorgularken kullanışlıdır.  
Örneğin, bir oyuncu lider tablosunu temsil eden bir sıralı setiniz olduğunu varsayalım ve bu lider tablosunda en iyi 10 oyuncuyu göstermek 
istediğimizde bu durumda, ZRANGE komutunu LIMIT argümanı ile kullanılabilir.

> <b>Node.js Syntax</b>
> ````javascript
> /**
> NOT: 0 - x değerini görmek istersek ZRANGE key 0 9 withsocre dememiz yeterli.
> Withscore: Değerleri score'ları ile birlikte getirir.
> Ama mesela X - Y aralığını görmek istiyorsak bu sefer LIMIT argumanını > 
> kullanırız. LIMIT 2 tane deger alır. Birisi Offset, digeri Count. Offset degeri
> baslangic noktasını temsil eder. Count degeri ise baslangictan sonra kac tane  > eleman geleceğini temsil eder.
> */
>
> ````
> <b>Redis Syntax</b>
> ````redis
> ZRANGEBYSCORE ProgrammingLanguages -inf +inf  withscores limit 10 3
> ````

<hr>

## BITMAPS
* Bitmap Redis içerisinde reel bir data type değildir. Temel olarak BitMap bir String'dir.
* Bir BitMap her bir bit'in 0 veya 1 depolayabildiği bir bit dizisidir. Yani bundan dolayı bir BitMap'i 
0'lar ve 1'lerden oluşan bir Array olarak düşünebilirsiniz.
* Bir Bitmap'i String üzerinde bit işlemleri yapan bir set olarak da düşünebiliriz. 
* Bitmap'ler ayrıca <i>BitArray</i> ve <i>Bitset</i> olarak da bilinir.
* Redis dokümantasyonu, Bitmap indekslerine offsetler olarak atıfta bulunur. Her bir Bitmap indeksinin ne anlama geldiği uygulama alanı tarafından belirlenir. 
Bitmap'ler hafıza açısından verimli olup, hızlı veri aramalarını destekler ve 2^32 bit'e kadar (4 milyardan fazla bit) saklayabilir. 

### BIT OPERATIONS
Bit işlemleri, bir biti 1 veya 0 olarak ayarlama veya değerini alma gibi sabit zamanlı tekil bit işlemleri ve örneğin belirli bir bit aralığında ayarlanmış bit sayısını sayma (örneğin, popülasyon sayımı) gibi bit grupları üzerinde yapılan işlemler olmak üzere iki gruba ayrılır.

Bitmap'lerin en büyük avantajlarından biri, bilgi depolarken sıklıkla aşırı yer tasarrufu sağlamalarıdır. Örneğin, farklı kullanıcıların artan kullanıcı ID'leri ile temsil edildiği bir sistemde, 4 milyar kullanıcının tekil bir bit bilgisini (örneğin, bir kullanıcının haber bülteni almak isteyip istemediğini bilmek) yalnızca 512 MB bellek kullanarak hatırlamak mümkündür.

<b><u><i>SETBIT</i></u></b>, ilk argüman olarak bit numarasını ve ikinci argüman olarak bitin ayarlanacağı değeri alır; bu değer 1 veya 0'dır. Komut, adreslenen bit mevcut string uzunluğunun dışındaysa string'i otomatik olarak genişletir.
Örneğin bir kullanıcının bir uygulamayı belirli bir günde kullanıp kullanmadğını temsil eder.
Redis'teki SETBIT komutu, belirli bir key'de saklanan string değerindeki belirli bir offset değerindeki biti ayarlar veya temizler. Bitin değeri value parametresine bağlı olarak 0 veya 1 olarak ayarlanır. Eğer belirtilen key mevcut değilse, yeni bir string değeri oluşturulur ve bu string, offset'teki bir biti barındırabilecek şekilde genişletilir. Offset argümanının 0 veya daha büyük ve 2^32'den küçük olması gerekmektedir; bu da Bitmap'lerin en fazla 512MB olabileceğini belirler. Key'in altındaki string genişletildiğinde, eklenen bitler 0 olarak ayarlanır.
<br>
><b>Node.js Syntax</b>
>````javascript
> const date = new Date();
> const day = date.getDay();
> const month = date.getMonth() + 1;
> const year = date.getFullYear();
> const key = year + '-' + (month < 10 ? '0' + month : month) + '-' + (day < 10 ? '0' + day > : day);
>const setBitOperation = await client.SETBIT(key, 10, 1);
>console.log(`SETBIT operation ==> ${setBitOperation}`);
>````
><b>Redis Syntax</b>
>````redis
>SETBIT key:2024-02-01 17 0
>````

<br>

<b><u><i>GETBIT</i></u></b>, belirtilen indeksteki bitin değerini döndürür. Aralık dışı bitler (hedef anahtar içinde saklanan string'in uzunluğunun dışında bir biti adresleme) her zaman sıfır olarak kabul edilir.
Örneğin belirli bir durumun kontrolünün sağlanması için kullanılabilir.

> <b>Node.js Syntax</b>
> ````javascript
>const getBitOperation = await client.GETBIT(key, 10);
>console.log(`GETBIT operation ==> ${getBitOperation}`);
> ````
> <b>Redis Syntax</b>
>````redis
> GETBIT key:2024-02-01 17
>````

Bit grupları üzerinde işlem yapan üç komut vardır:

* <b><i>BITOP</i></b>, farklı string'ler arasında bit düzeyinde işlemler gerçekleştirir. Sağlanan işlemler AND, OR, XOR ve NOT'tur.
<br>

* <b><i>BITCOUNT</i></b>, 1 ile işaretlenmiş sayıları döner. Örneğin belirli bir durum ile kaç kez karşılaşıldığını anlamak için kullanılır.
<b>Not:</b> Bir String key'in de Bitcount değeri vardır. Bu yüzden de range verilebilir.
> <b>Node.js Syntax</b>
> ````javascript
> const bitCountOperation = await client.BITCOUNT(key);
> console.log(`BITCOUNT operation ==> ${bitCountOperation}`);
> ````
> <b>Redis Syntax</b>
>````redis
> BITCOUNT mykey
>````

* <b><i>BITPOS</i></b>, belirtilen 0 veya 1 değerine sahip ilk biti bulur.

Hem BITPOS hem de BITCOUNT, string'in tüm uzunluğu için çalışmak yerine, string'in bayt aralıkları ile işlem yapabilir. Bir bitmap'de ayarlanmış bitlerin sayısını basitçe görebiliriz.

<hr>

## HYPERLOGLOGS

* HyperLogLogs Redis'te tam bir data type değildir.
* Kavramsal olarak, bir HyperLogLog, bir Set'te var olan benzersiz elemanların sayısının çok iyi bir yaklaşımını sağlamak için rastgelelik kullanan bir algoritmadır. Daha basit bir ifadeyle büyük veri setlerinde benzersiz elemanların sayısını (kardinalite) tahmin etmek için kullanılan bir algoritmadır. 
* HyperLogLog algoritması olasılıksaldır. Yani 100% doğruluk sağlamayı garanti etmez.
* HyperLogLog algoritması orijinal olarak Philippe Flajolet, Éric Fusy, Olivier Gandouet ve Frédéric Meunier tarafından yazılan "HyperLogLog: Neredeyse optimal kardinalite tahmin algoritmasının analizi" adlı makalede tanımlanmıştır. HyperLogLog'lar Redis 2.8.9'da tanıtılmıştır.
* Genellikle, benzersiz sayım yapmak için, sayımını yaptığınız kümedeki öğe sayısına orantılı bir hafıza miktarına ihtiyacınız vardır. HyperLogLog'lar bu tür problemleri harika performans, düşük hesaplama maliyeti ve az miktarda hafıza ile çözer. Ancak, HyperLogLog'ların %100 doğru olmadığını hatırlamak önemlidir. Yine de, bazı durumlarda, %99.19 yeterince iyidir. İşte HyperLogLog'ların kullanılabileceği birkaç örnek:

 -> Bir web sitesini ziyaret eden benzersiz kullanıcı sayısını saymak
 -> Belirli bir tarih veya saatte web sitenizde aranan farklı terimlerin sayısını saymak
 -> Bir kullanıcı tarafından kullanılan farklı hashtag'lerin sayısını saymak
 -> Bir kitapta görünen farklı kelimelerin sayısını saymak

* Benzersiz öğeleri saymak genellikle, saymak istediğiniz öğe sayısına orantılı bir hafıza miktarı gerektirir, çünkü çoklu sayımlardan kaçınmak için geçmişte zaten gördüğünüz elemanları hatırlamanız gerekir. Ancak, hafızayı doğrulukla takas eden bir algoritma seti mevcuttur: Bunlar, Redis'in HyperLogLog için uygulamasında %1'den az olan bir standart hatayla tahmini bir ölçüm döndürürler. Bu algoritmanın sihri, artık sayılan öğe sayısına orantılı bir hafıza miktarı kullanmanıza gerek kalmaması ve bunun yerine sabit bir hafıza miktarı kullanabilmenizdir.

* Redis'teki HyperLogLog'lar, teknik olarak farklı bir veri yapısı olsalar da, bir Redis string'i olarak kodlanır, böylece bir HyperLogLog'u serileştirmek için GET ve onu sunucuya geri serileştirmek için SET çağrılabilir.

* Kavramsal olarak HyperLogLog API'si, aynı görevi yapmak için Set'leri kullanmaya benzer. Gözlemlenen her elemanı bir sete SADD ile ekler ve setin içindeki benzersiz elemanların sayısını kontrol etmek için SCARD kullanırdınız, çünkü SADD mevcut bir elemanı yeniden eklemeyecektir.

* Gerçekte bir HyperLogLog'a ögeler eklemeseniz de, çünkü veri yapısı gerçek elemanları içermeyen bir durum içerir, API aynıdır:

* Yeni bir eleman gördüğünüz her seferinde, onu PFADD ile sayıma eklersiniz.
PFADD komutu kullanılarak eklenen benzersiz elemanların güncel yaklaşımını almak istediğinizde PFCOUNT komutunu kullanabilirsiniz. İki farklı HLL'yi birleştirmeniz gerekiyorsa, PFMERGE komutu mevcuttur. HLL'ler benzersiz elemanların yaklaşık sayılarını sağladığından, birleştirme sonucu her iki kaynak HLL'deki benzersiz elemanların sayısının bir yaklaşımını size verecektir.

### PFADD
* Redis'te PFADD komutu, HyperLogLog veri yapısına bir veya daha fazla eleman eklemek için kullanılır.
* HyperLogLog, benzersiz elemanların sayısını tahmin etmekte kullanılan bir algoritmadır ve PFADD komutu bu algoritmanın temel operasyonlarından biridir. Bu komut, verilen elemanları HyperLogLog'a ekler ve bu sayede veri yapısının benzersiz eleman sayısını tahmin etme kabiliyetini günceller.

* ``PFADD key element [element ...]``
* <i>key:</i> HyperLogLog veri yapısının adıdır. Eğer bu isimde bir veri yapısı yoksa, Redis otomatik olarak yeni bir HyperLogLog oluşturur.
* <i>element:</i> HyperLogLog'a eklenmek istenen eleman(lar). Birden fazla eleman eklemek için, elemanları aralarında boşluk bırakarak sıralayabilirsiniz.
* Eğer belirtilen key ile ilişkilendirilmiş bir HyperLogLog yoksa, Redis otomatik olarak yeni bir HyperLogLog oluşturur ve belirtilen eleman(lar)ı ekler.
* Eğer key zaten bir HyperLogLog'a işaret ediyorsa, Redis belirtilen eleman(lar)ı mevcut HyperLogLog'a ekler.
* PFADD komutu, eklenen eleman(lar)ın HyperLogLog'un iç durumunu değiştirdiyse (yani en az bir eleman HyperLogLog'a daha önce eklenmemişse) 1 döner. Eğer eklenen tüm elemanlar zaten HyperLogLog'da varsa ve iç durum değişmezse 0 döner.
* PFADD komutunun sonucu, veri yapısının iç durumunun değişip değişmediğine bağlıdır, ancak bu sonuç HyperLogLog'un tahmini benzersiz eleman sayısının ne olduğu hakkında bir bilgi vermez

> <b>Node.js Syntax</b>
>````javascript
> const programmingLanguages = ["ElasticSearch", "Redis", "Docker", "Kubernetes"]
> const hyperLogLog = await client.PFADD('books', > programmingLanguages);
> console.log(`PFADD OPERATION ==> ${hyperLogLog}`);
>````
> <b>Redis Syntax</b>
> `````redis
> PFADD visits:2015-01-01 "carl" "max" "hugo" "arthur"
>

### PFCOUNT
* PFCOUNT komutu, bir veya birden fazla anahtarı argüman olarak kabul eder. Tek bir argüman belirtildiğinde, yaklaşık kardinaliteyi döndürür. Birden fazla anahtar belirtildiğinde, tüm benzersiz elemanların birleşiminin yaklaşık kardinalitesini döndürür.
* PFCOUNT komutu tek bir key ile çağrıldığında, belirtilen key'de saklanan HyperLogLog veri yapısının hesapladığı yaklaşık kardinaliteyi döndürür. Eğer belirtilen anahtar mevcut değilse, 0 değerini döndürür.
* PFCOUNT komutu birden fazla keyle çağrıldığında, geçirilen HyperLogLog'ların birleşiminin yaklaşık kardinalitesini döndürür. Bu, içsel olarak belirtilen anahtarlarda saklanan HyperLogLog'ları geçici bir HyperLogLog'da birleştirerek yapılır.

<hr>

## TIMESERIES

* Bir TimeSeries, zaman aralığı boyunca yapılan sıralı değerler dizisi (veri noktaları) anlamına gelir.
* TimeSeries; istatistik, sosyal network ve iletişim mühendisliği alanlarında kullanılabilir. Ama aslında zaman ölçümü gerektiren alanlarda rahatlıkla kullanılabilir.
* TimeSeries, gelecekteki borsa değişikliklerini, emlak trendlerini, çevresel koşulları ve daha fazlasını tahmin etmek için kullanılabilir. Zaman serilerine örnekler şunlardır:
 -> Bir gazetede zaman içinde belirli kelimelerin veya terimlerin kullanımı
 -> Yıl bazında asgari ücret
 -> Hisse senedi fiyatlarında günlük değişiklikler
 -> Ay bazında ürün alımları
 -> İklim değişiklikleri
Birçok TimeSeries sistemi, bir veri seti çok hızlı bir şekilde büyüyebileceğinden depolama konusunda zorluklarla karşı karşıyadır. Her saniye olayları depolarken, her gün en az 86.400 veri noktası oluşturulur ve uzun bir süre boyunca bu kadar çok veri noktasını depolamak, özellikle Redis gibi bellek içi veri depoları için zorludur.


<hr>

## Pub/Sub
* 





