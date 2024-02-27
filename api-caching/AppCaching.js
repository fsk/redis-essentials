import axios from "axios";
import dotenv from 'dotenv';
import {createClient} from "redis";

dotenv.config();

const redisClient = createClient();

await redisClient.connect();

const cityEndpoint = (city) => `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${process.env.WEATHER_API_KEY}`;

const getWeather = async (city) => {

    let cachedEntry = await redisClient.get(`weather:${city}`);

    if (cachedEntry) {
        cachedEntry = JSON.parse(cachedEntry);
        return {...cachedEntry, 'source' : 'Redis Cache'}
    }

    let apiResponse = await axios.get(cityEndpoint(city));
    await redisClient.set(`weather:${city}`, JSON.stringify(apiResponse.data), {EX: 100});

    return {...apiResponse.data, 'source' : 'Weather API'}
}

const city = 'Ankara';
const t0 = new Date().getTime();
const result = await getWeather(city);
const t1 = new Date().getTime();

result.responseTime = `${t1-t0}ms`

console.log(result);
process.exit();