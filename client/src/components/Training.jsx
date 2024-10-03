import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { Dialog } from "primereact/dialog";
import Navbar from "./Navbar";
import axios from "axios";
import { MultiSelect } from "primereact/multiselect";

const CustomerService = {
  getCustomersMedium() {
    return new Promise((resolve) => {
      resolve([
        {
          training_code: "TR-001",
          trainer_name: "John Doe",
          start_date: "2024-01-01",
          end_date: "2024-01-10",
          status: "completed",
        },
        {
          training_code: "TR-002",
          trainer_name: "Jane Smith",
          start_date: "2024-02-15",
          end_date: "2024-02-25",
          status: "ongoing",
        },
      ]);
    });
  },
  // getUsers() {
  //   return new Promise((resolve) => {
  //     resolve([
  //       { _id: "1", username: "John Doe", role: "trainer" },
  //       { _id: "2", username: "Jane Smith", role: "trainer" },
  //       { _id: "3", username: "Alice Johnson", role: "user" },
  //       { _id: "4", username: "Bob Brown", role: "user" },
  //     ]);
  //   });
  // },
};

export default function Training() {
  const [trainings, setTrainings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState("");
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: "contains" },
    training_code: { value: null, matchMode: "startsWith" },
    trainer_name: { value: null, matchMode: "startsWith" },
    start_date: { value: null, matchMode: "equals" },
    end_date: { value: null, matchMode: "equals" },
    status: { value: null, matchMode: "equals" },
  });

  const [visible, setVisible] = useState(false);
  const [newTraining, setNewTraining] = useState({
    training_code: "",
    trainer: null,
    participants: [],
    start_date: null,
    end_date: null,
    status: "completed",
  });

  const [users, setUsers] = useState([]);

  const statuses = [
    { label: "Completed", value: "completed" },
    { label: "Ongoing", value: "ongoing" },
    { label: "Pending", value: "pending" },
  ];

  useEffect(() => {
    CustomerService.getCustomersMedium().then((data) => {
      const parsedData = data.map((item) => ({
        ...item,
        start_date: new Date(item.start_date),
        end_date: new Date(item.end_date),
      }));
      setTrainings(parsedData);
      setLoading(false);
    });

    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:8080/users/"); // Replace with your actual API endpoint
        setUsers(response.data); // Assuming response.data is an array of users
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
    // CustomerService.getUsers().then(setUsers);
  }, []);

  const formatDate = (value) => {
    return value instanceof Date
      ? value.toLocaleDateString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })
      : "";
  };

  const statusBodyTemplate = (rowData) => {
    return (
      <Tag value={rowData.status} severity={getSeverity(rowData.status)} />
    );
  };

  const getSeverity = (status) => {
    switch (status) {
      case "completed":
        return "success";
      case "ongoing":
        return "info";
      case "pending":
        return "warning";
      default:
        return null;
    }
  };

  const detailsBodyTemplate = (rowData) => {
    return (
      <Button
        label="Details"
        icon="pi pi-info-circle"
        className="p-button-text"
        onClick={() => viewDetails(rowData)}
      />
    );
  };

  const viewDetails = (rowData) => {
    console.log("Viewing details for training:", rowData);
  };

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };
    _filters["global"].value = value;
    setFilters(_filters);
    setGlobalFilter(value);
  };

  const header = (
    <div className="d-flex justify-content-between align-items-center mb-4">
      <h3>Training Sessions</h3>
      <div>
        <span className="p-input-icon-left mt-3 me-2">
          <InputText
            value={globalFilter}
            onChange={onGlobalFilterChange}
            placeholder="Global Search"
            style={{ paddingLeft: "2em" }}
          />
          <i
            className="pi pi-search"
            style={{
              position: "absolute",
              right: "15em",
              top: "50%",
            }}
          />
        </span>
        <Button
          label="Add Training"
          className="mx-3"
          icon="pi pi-plus"
          onClick={() => setVisible(true)}
        />
      </div>
    </div>
  );

  const handleDialogSubmit = () => {
    console.log("New Training:", newTraining);
    setVisible(false);
    setNewTraining({
      training_code: "",
      trainer: null,
      participants: [],
      start_date: null,
      end_date: null,
      status: "completed",
    });
  };

  const dialogFooter = (
    <div>
      <Button
        label="Cancel"
        icon="pi pi-times"
        onClick={() => setVisible(false)}
        className="p-button-text p-button-secondary me-2"
      />
      <Button
        label="Submit"
        icon="pi pi-check"
        onClick={handleDialogSubmit}
        className="p-button-text p-button-primary"
      />
    </div>
  );

  const trainerOptions = users
    .filter((user) => user.role === "trainer")
    .map((user) => ({ label: user.username, value: user._id }));

  const participantOptions = users
    .filter((user) => user.role === "user")
    .map((user) => ({ label: user.username, value: user._id }));

  return (
    <>
      <Navbar />

      <div className="card m-5">
        <DataTable
          value={trainings}
          paginator
          rows={10}
          dataKey="training_code"
          filters={filters}
          filterDisplay="row"
          loading={loading}
          globalFilterFields={[
            "trainer_name",
            "start_date",
            "end_date",
            "status",
            "training_code",
          ]}
          header={header}
          emptyMessage="No trainings found."
          className="p-datatable-gridlines"
        >
          <Column
            field="training_code"
            header="Training Code"
            sortable
            filter
            style={{ minWidth: "10rem" }}
          />
          <Column
            field="trainer_name"
            header="Trainer Name"
            sortable
            filter
            style={{ minWidth: "14rem" }}
          />
          <Column
            field="start_date"
            header="Start Date"
            body={(rowData) => formatDate(rowData.start_date)}
            sortable
            filter
            filterElement={
              <Calendar
                value={filters.start_date?.value}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    start_date: { value: e.value, matchMode: "equals" },
                  })
                }
                placeholder="Filter by Start Date"
                dateFormat="mm/dd/yy"
                showIcon
              />
            }
            style={{ minWidth: "12rem" }}
          />
          <Column
            field="end_date"
            header="End Date"
            body={(rowData) => formatDate(rowData.end_date)}
            sortable
            filter
            filterElement={
              <Calendar
                value={filters.end_date?.value}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    end_date: { value: e.value, matchMode: "equals" },
                  })
                }
                placeholder="Filter by End Date"
                dateFormat="mm/dd/yy"
                showIcon
              />
            }
            style={{ minWidth: "12rem" }}
          />
          <Column
            field="status"
            header="Status"
            body={statusBodyTemplate}
            sortable
            filter
            filterElement={
              <Dropdown
                value={filters.status?.value}
                options={statuses}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    status: { value: e.value, matchMode: "equals" },
                  })
                }
                placeholder="Filter by Status"
              />
            }
            style={{ minWidth: "10rem" }}
          />
          <Column
            header="Details"
            body={detailsBodyTemplate}
            style={{ minWidth: "8rem" }}
          />
        </DataTable>
      </div>

      <Dialog
        header="Add New Training"
        visible={visible}
        footer={dialogFooter}
        onHide={() => setVisible(false)}
        style={{ width: "50%" }} // You can adjust the width as needed
      >
        <div className="field mb-3">
          <label htmlFor="training_code">Training Code</label>
          <InputText
            id="training_code"
            value={newTraining.training_code}
            onChange={(e) =>
              setNewTraining({ ...newTraining, training_code: e.target.value })
            }
            placeholder="Enter Training Code"
            className="w-full" // Make input full width
          />
        </div>

        <div className="field mb-3">
          <label htmlFor="trainer">Select Trainer</label>
          <Dropdown
            id="trainer"
            value={newTraining.trainer}
            options={trainerOptions}
            onChange={(e) =>
              setNewTraining({ ...newTraining, trainer: e.value })
            }
            placeholder="Select a Trainer"
            className="w-full" // Make dropdown full width
          />
        </div>

        <div className="field mb-3">
          <label htmlFor="participants">Select Participants</label>
          <MultiSelect
            id="participants"
            value={newTraining.participants}
            options={participantOptions}
            onChange={(e) =>
              setNewTraining({ ...newTraining, participants: e.value })
            }
            placeholder="Select Participants"
            className="w-full" // Make multi-select full width
          />
        </div>

        <div className="field mb-3">
          <label htmlFor="start_date">Start Date</label>
          <Calendar
            id="start_date"
            value={newTraining.start_date}
            onChange={(e) =>
              setNewTraining({ ...newTraining, start_date: e.value })
            }
            placeholder="Select Start Date"
            dateFormat="mm/dd/yy"
            showIcon
            className="w-full" // Make calendar full width
          />
        </div>

        <div className="field mb-3">
          <label htmlFor="end_date">End Date</label>
          <Calendar
            id="end_date"
            value={newTraining.end_date}
            onChange={(e) =>
              setNewTraining({ ...newTraining, end_date: e.value })
            }
            placeholder="Select End Date"
            dateFormat="mm/dd/yy"
            showIcon
            className="w-full" // Make calendar full width
          />
        </div>

        <div className="field ">
          <label htmlFor="status">Status</label>
          <Dropdown
            id="status"
            value={newTraining.status}
            options={statuses}
            onChange={(e) =>
              setNewTraining({ ...newTraining, status: e.value })
            }
            placeholder="Select a Status"
            className="w-full" // Make dropdown full width
          />
        </div>
      </Dialog>
    </>
  );
}
