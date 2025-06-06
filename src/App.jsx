import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import Home from "./components/Home/Home";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import ResumeFormatter from "./components/Resume_read/Resume_formatter";
import ResumePreview from "./components/ResumePreview/ResumePreview";
import RouteLayout from "./layout/RouteLayout";
import ResumeLayout from "./layout/ResumeLayout";
import ProtectedRoute from "./components/Guard/ProtectedRoute";
import { AuthProvider } from "./context/AuthProvider";
import { ResumeProvider } from "./context/ResumeContext";
import { ToastContainer } from "react-toastify";
// import ResumeDownload from "./components/ResumePreview/ResumeDownload";
import ResumeDownloadPdf from "./components/ResumePreview/ResumeDownloadPdf";
import ResumeDownloadDocx from "./components/ResumePreview/ResumeDownloadDocx";
import Dashboard from "./components/Dashboard/Dashboard";
import ProjectDetail from "./components/project-Analysis/ProjectDetail";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/" element={<RouteLayout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>

        <Route
          path="resume"
          element={
            <ProtectedRoute>
              <ResumeLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="project/:id" element={<ProjectDetail />} />{" "}
        </Route>
      </>
    )
  );

  return (
    <AuthProvider>
      <ResumeProvider>
        <RouterProvider router={router} />
        <ToastContainer position="top-right" autoClose={3000} />
      </ResumeProvider>
    </AuthProvider>
  );
}

export default App;
