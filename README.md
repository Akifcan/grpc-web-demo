# GRPC DEMO WITH REACT.JS AND NODE CLIENT

## For Run App

- `npm i `
- `npm i protoc-gen-grpc-web`
- Install [protoc-gen-grpc-web](https://github.com/grpc/grpc-web/releases)
- Install [protoc](https://github.com/protocolbuffers/protobuf/releases)
- in src folder run this command `protoc -I. helloword.proto --js_out=import_style=commonjs:. --grpc-web_out=import_style=commonjs,mode=grpcwebtext:.`
- Run Server `nodemon server.js` or `node server.js`
- Run envoy server `docker run -d -v $pwd/envoy.yaml:/etc/envoy/envoy.yaml:ro -p 8080:8080 -p 9901:9901 envoyproxy/envoy:v1.17.0`
- React: `npm run start`
- For node client `node node_client.js`
