import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./config.scss";
import { LoginPage } from "./components/LoginPage";
import { RegistrationPage } from "./components/RegistrationPage";
import { MainPage } from "./components/MainPage";

function App() {
  return (
    <div className="wrapper">
      <BrowserRouter>
        <div className="main-content">
          <Routes>
            <Route path="/">
              <Route index element={<LoginPage />} />
              <Route path="sign-up">
                <Route index element={<RegistrationPage />} />
              </Route>
              <Route path="main">
                <Route index element={<MainPage />} />
              </Route>
            </Route>
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
