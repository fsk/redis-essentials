import { createClient } from "redis";

const client = createClient();

await client.connect();

if (process.argv.length < 3) {
    console.error("ERROR: You need to specify a data type!");
    console.log("$ node using-timeseries.js [string|hash]");
    process.exit(1);
}

const dataType = process.argv[2].toLowerCase();
const moduleName = `./TimeSeries-${dataType}.js`;

try {
    const module = await import(moduleName);
    const TimeSeries = module.TimeSeries;
} catch (error) {
    console.error(`ERROR: Could not load the module '${moduleName}'. Make sure the file exists and the path is correct.`);
    process.exit(1);
}

await client.FLUSHALL();

const { TimeSeries } = await import(moduleName);

const item1Purchases = new TimeSeries(client, "purchases:item1");

const beginTimestamp = 0;

await item1Purchases.insert(beginTimestamp);
await item1Purchases.insert(beginTimestamp + 1);
await item1Purchases.insert(beginTimestamp + 2);
await item1Purchases.insert(beginTimestamp + 3);
await item1Purchases.insert(beginTimestamp + 61);

async function displayResults(granularityName, beginTimestamp, endTimestamp) {
    try {
        const results = await item1Purchases.fetch(granularityName, beginTimestamp, endTimestamp);
        console.log("Results from " + granularityName + ":");
        console.log("Timestamp \t| Value");
        console.log("--------------- | ------");
        for (const element of results) {
            console.log('\t' + element.timestamp + '\t| ' + element.value);
        }
        console.log();
    } catch (error) {
        console.error(`Error fetching data for granularity ${granularityName}: ${error}`);
    }
}

await displayResults("1sec", beginTimestamp, beginTimestamp + 4);
await displayResults("1min", beginTimestamp, beginTimestamp + 120);

await client.quit();