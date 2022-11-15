import { Table } from "antd";
import { Outlet } from "react-router-dom";
import Navbar from "../navbar/Navbar";
import Sidebar from "../sidebar/Sidebar";
import DataTable from "../tables/Table";
import Home from "../../pages/home/Home";
import BreadCrumb from "../BreadCrumb";
const AppLayout = () => {
    return ( 
        <div className="wrapper">
            <Sidebar/>
            <Navbar/>
            <div className="page-wrapper">
                <BreadCrumb/>
                <Outlet />
            </div>
            
        </div>
     );
}
 
export default AppLayout;