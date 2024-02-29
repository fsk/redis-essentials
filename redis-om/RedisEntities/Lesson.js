import {Schema} from "redis-om";

export const lessonSchema = new Schema('lesson', {
    lessonName: {type: 'string'},
    capacity: {type: 'number'},
    startTime: {type: 'string'}
}, {
    dataStructure: 'JSON'
})