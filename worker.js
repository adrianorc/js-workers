'use strict'

const { parentPort, workerData } = require('worker_threads'),
    {  waitMs } = require('./lib');

/**
 * Sample worker class
 */
class SampleWorker {

    constructor({workerId}) {
        this.workerId = workerId;
    }

    /**
     * Entrypoint of this job
     * 
     */
    async run() {
        for(let i=0; i<5; i++) {
            console.log(`Workder id=${this.workerId}. Working... ${i}`);
            await waitMs(500);
        }
    }

}

function create() {
    return new SampleWorker(workerData);
}

(async () => {
    try {
        let w = create();
        await w.run();
        parentPort.postMessage('done');
        process.exit(0);
    } catch (err) {
        console.error(err);
    }
})();
