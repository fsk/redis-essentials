import {LessonRepository} from "../Repositories/LessonRepository.js";

class LessonService {
    async saveLesson(lesson) {
        return await LessonRepository.prototype.save(lesson)
    }

    async getLesson(lessonId) {
        return await LessonRepository.prototype.get(lessonId);
    }

    async addTTL(lessonId, ttlTime) {
        return await LessonRepository.prototype.createTTL(lessonId, ttlTime);
    }

    async getAll() {
        return await LessonRepository.prototype.getAllKeys();
    }
}

export { LessonService }