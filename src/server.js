const PROTO_PATH = 'helloword.proto';

const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const _ = require('lodash');
var assert = require('assert');
var async = require('async');

let packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    });




let hellowordproto = grpc.loadPackageDefinition(packageDefinition).helloworld;

function doSayHello(call, callback) {
    callback(null, { message: 'Hello! ' + call.request.name });
}



function doSayRepeatHello(call) {
    var senders = [];
    function sender(name) {
        return (callback) => {
            call.write({
                message: 'Hey! ' + name
            });
            _.delay(callback, 500); // in ms
        };
    }
    for (var i = 0; i < call.request.count; i++) {
        senders[i] = sender(call.request.name + i);
    }
    async.series(senders, () => {
        call.end();
    });
}


const planes = [
    {
        name: 'airbus',
        model: 'A380'
    },
    {
        name: 'airbus',
        model: 'A350'
    },
    {
        name: 'antonov',
        model: 'AN225'
    },
]

function doPlanes(call) {
    console.log(call.request);
    planes.forEach((type, index) => {
        console.log(2000 * index);
        setTimeout(() => {
            call.write({ ...type, willSuicide: call.request.person })
        }, 2000 * index)
    })
    setTimeout(() => {
        call.end()
    }, 10000)
}

function getPilot(call, callback) {
    callback(null, { pilot_name: call.request.pilot_name });
}


function getServer() {
    var server = new grpc.Server();
    server.addService(hellowordproto.Greeter.service, {
        sayHello: doSayHello,
        planes: doPlanes,
        getPilot,
        sayRepeatHello: doSayRepeatHello,
    });
    return server;
}


var server = getServer();
server.bindAsync(
    '0.0.0.0:9090', grpc.ServerCredentials.createInsecure(), (err, port) => {
        assert.ifError(err);
        server.start();
        console.log(port);
    });

