import {createClient} from "redis";

class RedisClient {
    constructor() {
        if (!RedisClient.instance) {
            this._client = createClient({
                socket: {
                    port: process.env.REDIS_PORT,
                    host: process.env.REDIS_HOST
                }
            });
            this._client.on('error', (err) => {
                console.log(`Redis client error ==> ${err}`);
            })
            RedisClient.instance = this;
        }
    }

    async connect() {
        if (!this._client.isOpen) {
            await this._client.connect();
        }
    }

    get client() {
        return this._client;
    }

    async disconnect() {
        if (this._client.isOpen) {
            await this._client.quit();
        }
    }
}

const instance = new RedisClient();
Object.freeze(instance);

export default instance;