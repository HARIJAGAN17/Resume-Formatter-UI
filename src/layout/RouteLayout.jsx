import Navbar from "../components/Navbar/Navbar";
import { Outlet } from "react-router-dom";

function RouteLayout() {
    return (
        <div>
            <Navbar/>
            <Outlet/>
        </div>
    )
}

export default RouteLayout;
