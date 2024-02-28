import express from 'express';
import dotenv from 'dotenv';
import {LessonController} from "./Controllers/LessonController.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3550;

app.use(express.json());


app.get("/deneme", (req, res) => {
    console.log("Deneme");
    console.log("\n");
    console.log(`${req}`);
})

app.post('/lessons', (req, res) =>
    LessonController.prototype.createLesson(req, res)
);

app.get('/lessons/getById/:id', (req, res) =>
    LessonController.prototype.getLesson(req, res)
);

app.post('/lessons/addToTtl', (req, res) =>
    LessonController.prototype.addTTL(req, res)
);

app.get('/lessons/getAll/', (req, res) =>
    LessonController.prototype.getAllFromRedis(req, res)
);



app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});