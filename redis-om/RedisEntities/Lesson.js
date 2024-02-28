import {Schema} from "redis-om";

export class Lesson {

    constructor(lessonName, capacity, startTime) {
        this.lessonName = lessonName;
        this.capacity = capacity;
        this.startTime = startTime;
    }

}

export const lessonSchema = new Schema('lesson', {
    lessonName: {type: 'string'},
    capacity: {type: 'number'},
    startTime: {type: 'string'}
})