const keys = [123, 456, 789];
const values = [{name: 'Furkan'}, {name: 'Sahin'}, {name: 'Kulaksiz'}];

const arr = [];

for (let i = 0; i < keys.length; i++) {

    arr.push(keys[i]);
    arr.push(JSON.stringify(values[i]));
}

console.log(arr);