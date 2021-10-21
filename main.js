'use strict'

const { Worker } = require('worker_threads'),
    {  waitMs } = require('./lib');

let workers = [];

function handleWorkerMessage(workerId, message) {
    if (message == 'done') {
        let worker = workers.find(w => w.workerId === workerId);
        worker.running = false;
        console.log(`Worker ${workerId} is done!`);
    }
}

// create 5 workers 
for(let i=1; i<=5; i++) {
    let workerId = (i*100);

    const worker = new Worker("./worker.js", {workerData: {workerId}});
    worker.on('message', msg => handleWorkerMessage(workerId, msg));

    workers.push({worker, workerId, running: true});
}

(async () => {
    let allDone = false;

    do {
        allDone = workers.every(w => !w.running);
        await waitMs(10);
    } while (!allDone /*or some timeout has passed*/ );

    console.log(`All workers are done!!`);
    process.exit(0);
})();


