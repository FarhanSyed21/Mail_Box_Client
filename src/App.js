import LogIn from "./Components/Registration Form/LogIn";
import SignUp from "./Components/Registration Form/SignUp";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Inbox from "./Components/Home/Inbox";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import ComposeMail from "./Components/Home/ComposeMail";
import MailDetails from "./Components/EmailDetailsPage/MailDetails";
import { useSelector } from "react-redux";

function App() {
  const userIsLoggedIn = useSelector((state) => state.auth.isAuthenticated);

  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route
            path="/"
            element={
              !userIsLoggedIn ? <LogIn /> : <Navigate to="/home" replace />
            }
          />
          <Route
            path="/signup"
            element={
              !userIsLoggedIn ? <SignUp /> : <Navigate to="/home" replace />
            }
          />
          <Route
            path="/home"
            element={userIsLoggedIn ? <Inbox /> : <Navigate to="/" replace />}
          />
          <Route
            path="/compose"
            element={
              userIsLoggedIn ? <ComposeMail /> : <Navigate to="/" replace />
            }
          />
          <Route
            path="/details"
            element={
              userIsLoggedIn ? <MailDetails /> : <Navigate to="/" replace />
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
