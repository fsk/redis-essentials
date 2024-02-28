import {Repository} from "redis-om";
import {lessonSchema} from "../RedisEntities/Lesson.js";
import redisClient from "../connection/RedisClient.js";

class LessonRepository {
    constructor() {
        this.lessonRepository = null;
    }

    async connect() {
        if (!this.lessonRepository) {
            await redisClient.connect();
            this.lessonRepository = new Repository(lessonSchema, redisClient.client);
        }
    }

    async save(lesson) {
        await this.connect();
        const entityId = await this.lessonRepository.save(lesson);
        return entityId;
    }

    async get(lessonId) {
        await this.connect();
        const lesson = await this.lessonRepository.fetch(lessonId);
        return lesson;
    }

    async createTTL(lessonId, ttlTime) {
        await this.connect();
        await this.lessonRepository.expire(lessonId, ttlTime);
    }

    async getAllKeys() {
        await this.connect();
        return await this.lessonRepository.search().return.all();
    }
}

export { LessonRepository }
