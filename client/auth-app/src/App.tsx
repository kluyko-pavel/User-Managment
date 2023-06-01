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
              <Route path="table">
                <Route index element={<div>jhgjhgjg</div>} />
              </Route>
              <Route path="sign-up">
                <Route index element={<RegistrationPage />} />
              </Route>
            </Route>
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
