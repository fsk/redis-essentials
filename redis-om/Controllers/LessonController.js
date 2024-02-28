import {LessonService} from "../Service/LessonService.js";

class LessonController {
    async createLesson(req, res) {
        try {
            const lesson = req.body;
            const entityId = await LessonService.prototype.saveLesson(lesson);
            res.status(201).send({ entityId });
        }catch (err) {
            res.status(500).send(err.message);
        }
    }

    async getLesson(req, res) {
        try {
            const lessonId = req.params.id;
            const lesson = await LessonService.prototype.getLesson(lessonId);
            res.status(200).send({ lesson });
        }catch (err) {
            res.status(500).send(err.message);
        }
    }

    async addTTL(req, res) {
        try {
            const lessonId = req.body.lessonId;
            const ttlTime = req.body.ttlTime;
            const addTTL = await LessonService.prototype.addTTL(lessonId, ttlTime);
            res.status(201).send({ });
        }catch (err) {
            res.status(500).send(err.message);
        }
    }

    async getAllFromRedis(req, res) {
        try {
            const getAll = await LessonService.prototype.getAll();
            res.status(200).send(getAll)
        }catch (err) {
            res.status.send(err.message);
        }
    }
}


export { LessonController }