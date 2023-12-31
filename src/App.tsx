import { SyntheticEvent } from "react";
import firebaseLogo from "./assets/firebase.svg";
import "./App.css";
import { useAuthContext } from "./firebase/AuthContext";

function App() {
  const { isSignedIn, signInWithGoogle, logout, user } = useAuthContext();

  async function handleLogin(event: SyntheticEvent) {
    event.preventDefault();
    try {
      await signInWithGoogle();
    } catch (e) {
      window.alert(e.message);
    }
  }

  async function handleLogout(event: SyntheticEvent) {
    event.preventDefault();
    try {
      await logout();
    } catch (e) {
      window.alert(e.message);
    }
  }

  return (
    <>
      <div>
        <a href="https://console.firebase.google.com/" target="_blank">
          <img
            src={firebaseLogo}
            className="logo firebase"
            alt="Firebase logo"
            height={120}
          />
        </a>
        {user && (
          <>
            <span
              style={{
                fontSize: "2rem",
                padding: "2rem",
                position: "relative",
                top: -40,
              }}
            >
              +
            </span>
            <img
              alt="avatar"
              src={user.photoURL}
              style={{
                borderRadius: "50%",
                margin: "10px",
              }}
              referrerPolicy="no-referrer"
              height={100}
            />
          </>
        )}
      </div>
      <h1>react-firebase-typescript-boilerplate</h1>
      {isSignedIn ? (
        <div className="card">
          {user ? (
            <>
              <p>
                Hi <strong>{user.displayName}</strong>, welcome!
              </p>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <p>Loading user info...</p>
          )}
        </div>
      ) : (
        <div className="card">
          <button onClick={handleLogin}>Sign-in with Google</button>
        </div>
      )}
    </>
  );
}

export default App;
