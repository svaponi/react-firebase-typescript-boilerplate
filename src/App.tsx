import { useState } from "react";
import firebaseLogo from "./assets/firebase.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <a href="https://firebase.google.com/" target="_blank">
          <img
            src={firebaseLogo}
            className="logo firebase"
            alt="Firebase logo"
          />
        </a>
      </div>
      <h1>react-firebase-typescript-boilerplate</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>
    </>
  );
}

export default App;
