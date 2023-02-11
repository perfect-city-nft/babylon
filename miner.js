let window = {};

importScripts("https://cdn.jsdelivr.net/npm/keccak256@latest/keccak256.js")

onmessage = (e) => {
    console.log("worker", e)
    const amount = 100000

    for (let iteration = e.data.iteration; iteration < 10000000; iteration++) {
        console.log(iteration)
        let startTime = performance.now()

        for (let i = iteration * amount; i < (iteration + 1) * amount; i++) {
            let hash = window.keccak256(longToByteArray(i).concat(e.data.args))

            if (compareBytes(hash, e.data.difficulty) < 1) {
                postMessage({type: "done", work: i, hash: hash});
                break;
            }
        }

        postMessage({type: "speed", iteration: iteration, speed: Math.round(amount / (performance.now() - startTime) * 10000) / 10});

        iteration++;
    }
}

let longToByteArray = function(long) {
    // we want to represent the input as an 8-bytes array
    let byteArray = [];

    for (let index = 0; index < 32 && long > 0; index++) {
        let byte = long & 0xff;
        byteArray.push(byte);
        long = (long - byte) / 256;
    }

    return Array(32-byteArray.length).fill(0).concat(byteArray.reverse());
};

let compareBytes = function(a, b) {
    if (a.length < b.length) {
        return -1
    }

    if (a.length > b.length) {
        return 1
    }

    for (let i = 0; i < a.length; i++) {
        if (a[i] > b[i]) {
            return 1
        }

        if (a[i] < b[i]) {
            return -1
        }
    }

    return 0
}
