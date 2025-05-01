import Home from "./components/Home/Home";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import RouteLayout from "./layout/RouteLayout";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<RouteLayout />}>
        <Route index element={<Home/>} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>
    )
  );

  return (
    <RouterProvider router={router}/>
  )
}

export default App;
