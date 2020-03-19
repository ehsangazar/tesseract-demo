import React, { useCallback, useState } from "react";
import Tesseract from "tesseract.js";
import { useDropzone } from "react-dropzone";

import Loading from './loading.gif'
import './App.css';


function App() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(false);
  const [image, setImage] = useState(false);
  const onDrop = useCallback(acceptedFiles => {
    setLoading(true)
    acceptedFiles.forEach(file => {
      const url = Object.assign(file, {
        preview: URL.createObjectURL(file)
      })
      setImage(url.preview);
      Tesseract.recognize(url.preview, "eng", {
        logger: m => console.log(m)
      }).then(({ data: { text } }) => {
        console.log("text", text);
        setResult(text);
        setLoading(false);
      });
    });
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className="App">
      <header className="App-header">
        <h1>Tesseract Demo</h1>
        {!loading && (
          <div className="dropzone" {...getRootProps()}>
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>Drop the files here ...</p>
            ) : (
              <p>Drag 'n' drop some files here, or click to select files</p>
            )}
          </div>
        )}
        {image && <img className="img" src={image} />}
        {loading && <img className="loading" src={Loading} />}
        {result && !loading && <div className="result">{result}</div>}
      </header>
    </div>
  );
}

export default App;
