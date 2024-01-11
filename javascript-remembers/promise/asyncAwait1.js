async function asyncProcess() {
    return "Process done";
}

asyncProcess()
    .then(item => console.log(item))
    .finally(() => {
        console.log(`Finally Block`);
    });