import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
const { HelloRequest, RepeatHelloRequest, PlaneRequest, PilotRequest } = require('./helloword_pb.js');
const { GreeterClient } = require('./helloword_grpc_web_pb.js');

const client = new GreeterClient('http://' + window.location.hostname + ':8080',
  null, null);

// simple unary call
const request = new HelloRequest();
request.setName('World');

const streamRequest = new RepeatHelloRequest();
streamRequest.setCount(5);
const stream = client.sayRepeatHello(streamRequest, {});


function App() {

  const [showPilot, setShowPilot] = useState(false)
  const [pilot, setPilot] = useState('')
  const [planes, setPlanes] = useState([])


  useEffect(() => {
    const planeRequest = new PlaneRequest()
    planeRequest.setPilot('kaptan baha')
    const planeStream = client.planes(planeRequest, {})

    planeStream.on('data', response => {
      console.log(response.toObject());
      setPlanes(prev => [...prev, response.toObject()])
    })

    planeStream.on('end', response => {
      const pilotRequest = new PilotRequest()
      pilotRequest.setPilotName('kaptan baha')
      client.getPilot(pilotRequest, {}, (err, response) => {
        console.log(response.toObject());
        setPilot(response.toObject().pilotName)
        setShowPilot(true)
      });
    })

  }, [])



  return (
    <div className="App">
      <ul>
        {planes.map((plane, index) => {
          return <li key={index}><b>Name</b> {plane.name} <b>Model</b> {plane.model} </li>
        })}
      </ul>
      {showPilot ? <h1>And Pilot:: {pilot} ✈✈✈✈✈👨‍✈️👨‍✈️👨‍✈️👨‍✈️👩‍✈️👩‍✈️👩‍✈️👩‍✈️👩‍✈️</h1> : <h1></h1>}

    </div>
  );
}

export default App;
