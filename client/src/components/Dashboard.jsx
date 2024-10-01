import React from "react";
import { PrimeReactProvider } from 'primereact/api';
import Navbar from './Navbar';
import { Card } from "./Card";

const Dashboard = () => {
    return (<>

        {/* <div className="d-flex  justify-content-center">
            <Table/>
        </div> */}
        <Navbar />
        <Card />
           
    </>
    )
};
export default Dashboard;