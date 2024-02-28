import {Schema} from "redis-om";

export class Student {
    constructor(fullName, email, identityNumber, department, lessons, schoolNumber) {
        this.fullName = fullName;
        this.email = email;
        this.identityNumber = identityNumber;
        this.department = department;
        this.lessons = lessons;
        this.schoolNumber = schoolNumber;
    }
}

export const studentSchema = new Schema(Student, {
    fullName: {type: 'string', field: 'student_fullName'},
    email: {type: 'string', field: 'student_email'},
    identityNumber: {type: 'string', field: 'student_identityNumber'},
    department: {type: 'string', field: 'student_department'},
    lesson: {type: 'string[]', field: 'student_department'},
    schoolNumber: {type: 'number', field: 'student_schoolNumber'}
}, {
    dataStructure: 'JSON'
})