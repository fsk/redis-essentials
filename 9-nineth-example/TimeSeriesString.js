import { createClient } from "redis"

const client = createClient();

await client.connect();

if (process.argv.length < 3) {
    console.error("ERROR: You need to specify a data type!");
    console.log("$ node using-timeseries.js [string|hash]");
    process.exit(1);
}

const dataType = process.argv[2];

await client.FLUSHALL();

const timeseriesModule = await import(`./timeseries-${dataType}.js`);

const item1Purchases = new timeseriesModule.TimeSeries(client, "purchases:item1");

const beginTimestamp = 0;

item1Purchases.insert(beginTimestamp);
item1Purchases.insert(beginTimestamp + 1);
item1Purchases.insert(beginTimestamp + 1);
item1Purchases.insert(beginTimestamp + 3);
item1Purchases.insert(beginTimestamp + 61);

function displayResults(granularityName, results) {
    console.log("Results from " + granularityName + ":");
    console.log("Timestamp \t| Value");
    console.log("--------------- | ------");
    for (var i = 0; i < results.length; i++) {
        console.log('\t' + results[i].timestamp + '\t| ' +
            results[i].value);
    }
    console.log();
}

item1Purchases.fetch("1sec", beginTimestamp, beginTimestamp + 4, displayResults);

item1Purchases.fetch("1min", beginTimestamp, beginTimestamp + 120, displayResults);


client
    .quit()
    .then(r => console.log(`${r}`))
    .catch(err => console.log(`${err}`));