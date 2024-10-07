import React from "react";
import { PrimeReactProvider } from "primereact/api";
import Navbar from "./Navbar";
import { Card } from "./Card";
import { StackGraph } from "./Graph";
import { PieChart } from "./Graph";

const Dashboard = () => {
  return (
    <>
      {/* <div className="d-flex  justify-content-center">
            <Table/>
        </div> */}
      <Navbar />
      <Card />
      <div className=" d-flex justify-content-center align-items-center mt-3 mx-5 ">
        <div style={{ width: "70%", minWidth: "300px" }}>
          <StackGraph />
        </div>
        <div style={{ width: "20%", marginLeft: "5rem" }}>
          <PieChart />
        </div>
      </div>
    </>
  );
};
export default Dashboard;
