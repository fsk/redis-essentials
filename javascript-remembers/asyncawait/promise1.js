let getOrder = function (order) {
    return new Promise(function (res, rej) {
        console.log(`${order} preparing...`);

        let orderReady = Math.random() > 0.5;

        setTimeout(() => {
            if (orderReady) {
                res(`${order} ready`);
            }else {
                rej(new Error(`${order} error`));
            }
        })
    })
};



getOrder("Coffee").then(result => {
    console.log(result)
}).catch(err => {
    console.log(err)
}).finally(item => {
    console.log(`Finally Block ${item}`);
})

//GitHub Gist address
//https://gist.github.com/fsk/ad2453de012107657f709a8a5e0f36f1