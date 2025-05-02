import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import Home from "./components/Home/Home";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import Resume_formatter from "./components/Resume_read/Resume_formatter";
import RouteLayout from "./layout/RouteLayout";
import ProtectedRoute from "./components/Guard/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<RouteLayout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route
          path="resume"
          element={
            <ProtectedRoute>
              <Resume_formatter />
            </ProtectedRoute>
          }
        />
      </Route>
    )
  );

  return (
    <AuthProvider>
      <>
        <RouterProvider router={router} />
        <ToastContainer position="top-right" autoClose={2000} />
      </>
    </AuthProvider>
  );
}

export default App;
