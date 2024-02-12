const date = new Date();

console.log(date.getFullYear());


const day = date.getDay();
const month = date.getMonth() + 1;
const year = date.getFullYear();


const fullDate = year + '-' + (month < 10 ? '0' + month : month) + '-' + (day < 10 ? '0' + day : day);

console.log(fullDate);