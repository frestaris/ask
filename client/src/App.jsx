import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";

import { ToastContainer } from "react-toastify";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Header from "./components/Header";
import FooterCom from "./components/FooterCom";
import PrivateRoute from "./components/PrivateRoute";
import { SidebarProvider } from "./contexts/SidebarContext";
import CreateQuestion from "./pages/CreateQuestion";
import UpdateQuestion from "./pages/UpdateQuestion";
import OnlyAdminPrivateRoute from "./components/OnlyAdminPrivateRoute";
import QuestionPage from "./pages/QuestionPage";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  return (
    <BrowserRouter>
      <div className="d-flex flex-column min-vh-100">
        <ScrollToTop />
        <SidebarProvider>
          <ToastContainer position="top-center" autoClose={2000} /> <Header />
          <main className="flex-grow-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/sign-in" element={<SignIn />} />
              <Route path="/sign-up" element={<SignUp />} />
              <Route
                path="/question/:questionSlug"
                element={<QuestionPage />}
              />
              <Route element={<PrivateRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/create-question" element={<CreateQuestion />} />
              </Route>
              <Route element={<OnlyAdminPrivateRoute />}>
                <Route
                  path="/update-question/:questionId"
                  element={<UpdateQuestion />}
                />
              </Route>
            </Routes>
          </main>
          <FooterCom />
        </SidebarProvider>
      </div>
    </BrowserRouter>
  );
}

export default App;
