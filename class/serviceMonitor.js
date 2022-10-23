class ServiceMonitor {
    constructor(services) {
        this.services = services;
        this.openPorts = [];
        this.closedPorts = [];
        //console.log('service monitor');
    }

    getClosedPorts() {
        return this.closedPorts;
    }

    getOpenPorts() {
        return this.openPorts;
    }

    async monitor() {
        let status = {
            testedUrl: {},
            openPorts: [],
            closedPorts: []
        }

        for (let service of this.services) {
            //console.log('service', service);
            let isAlive = await this.ping(service);
            //console.log('isAlive', isAlive);
            //console.log('isAlive', isAlive);
            status.testedUrl[`${service.address}:${service.port}`] = isAlive
        }

        status.openPorts = this.openPorts;
        status.closedPorts = this.closedPorts;
        return status
    }



    ping(connection) {
        console.log('ping');
        return new Promise((resolve, reject) => {
            const tcpp = require('tcp-ping');
            tcpp.ping(connection, (err, data) => {
                let error = data.results[0].err
                if (error) {
                    this.closedPorts.push(data);
                    resolve(true);
                } else {
                    this.openPorts.push(data);
                    resolve(false);
                }
            });
            console.log('pong');
        })
    }
}

module.exports = ServiceMonitor;