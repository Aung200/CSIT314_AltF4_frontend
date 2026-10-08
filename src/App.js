import logo from "./logo.svg";
import "./App.css";

import { useState, useEffect } from "react";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("https://backend-52c7fa59.fastapicloud.dev/")
      .then((response) => response.json())
      .then((data) => setMessage(data.message));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Backend : {message}
        </p>
      </header>
    </div>
  );
}

export default App;
