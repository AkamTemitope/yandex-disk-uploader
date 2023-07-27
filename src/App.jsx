import { useState } from "react";
import { YandexLogin, YandexLogout } from "react-yandex-login";

import "./App.css";
import YandexDiskUploader from "./components/YandexDiskUploader";

export default function App() {
  const [token, setToken] = useState(sessionStorage.getItem("token"));

  const loginSuccess = (userData) => {
    sessionStorage.setItem("token", userData.access_token);
    setToken(userData.access_token);
  };

  const logoutSuccess = () => {
    setToken(null);
    sessionStorage.clear();
  };

  return (
    <div className="app">
      {!token && (
        <div className="login">
          <YandexLogin
            clientID={import.meta.env.VITE_CLIENT_ID}
            onSuccess={loginSuccess}
          >
            <button>Login to upload to account</button>
          </YandexLogin>
        </div>
      )}
      {token && (
        <div className="uploader">
          <div className="logout">
            <YandexLogout onSuccess={logoutSuccess}>
              <button>Logout</button>
            </YandexLogout>
          </div>

          <div>
            <YandexDiskUploader auth={token} />
          </div>
        </div>
      )}
    </div>
  );
}
