var PROTO_PATH = 'helloword.proto';

var async = require('async');
var grpc = require('@grpc/grpc-js');
var protoLoader = require('@grpc/proto-loader');
var packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    });
var protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
var helloworld = protoDescriptor.helloworld;
var client = new helloworld.Greeter('localhost:9090',
    grpc.credentials.createInsecure());

/**
 * @param {function():?} callback
 */
function runSayHello(callback) {
    client.sayHello({ name: 'John' }, {}, (err, response) => {
        console.log(response.message);
        callback();
    });
}

function runPlanes(callback) {
    const stream = client.planes({ pilot: 'kaptan baha' }, {})
    stream.on('data', response => {
        console.log(response);
    })
    stream.on('end', _ => {
        callback()
    })
}


/**
 * @param {function():?} callback
 */
function runSayRepeatHello(callback) {
    var stream = client.sayRepeatHello({ name: 'John', count: 5 }, {});
    stream.on('data', (response) => {
        console.log(response.message);
    });
    stream.on('end', () => {
        callback();
    });
}

function findPilot(callback) {
    client.getPilot({ pilot_name: 'Kaptan Baha' }, {}, (err, response) => {
        console.log(response.pilot_name);
        callback()
    })
}


/**
 * Run all of the demos in order
 */
function main() {
    async.series([
        // runPlanes,
        findPilot
    ]);
}

main();
