import logo from './logo.svg';
import './App.css';
import * as tf from "@tensorflow/tfjs";
import * as speech from "@tensorflow-models/speech-commands";
import React, { useEffect, useState } from 'react';
const App = () => {



  const [model, setModel] = useState(null);
  const [action, setAction] = useState(null);
  const [labels, setLabels] = useState(null);


  const loadModel = async () => {
    const reconiger = await speech.create("BROWSER_FFT");
    console.log("Modal Loaded")
    await reconiger.ensureModelLoaded()
    console.log(reconiger.wordLabels())
    setModel(reconiger)
    setLabels(reconiger.wordLabels());
  }



  useEffect(() => { loadModel() }, []);


  function argMax(arr) {
    return arr.map((x, i) => [x, i]).reduce((r, a) => (a[0] > r[0] ? a : r))[1];
  }

  const reconigeCommands = async () => {
    console.log('listening for commands')
    model.listen(result => {
      console.log(result)
      setAction(labels[argMax(Object.values(result.scores))])
      console.log(action)
    }, { includeSpectrogram: true, probabilityThreshold: 0.9 })
    setTimeout(() => model.stopListening(), 10e3);
  }



  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <button onClick={reconigeCommands}>Command</button>
        {action ? <div>{action}</div> : <div>No action Detected</div>}

      </header>
    </div>
  );
}

export default App;
