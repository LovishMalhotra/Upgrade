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
import { MultiSelect } from "primereact/multiselect";
import axios from 'axios'; // Import Axios

const CustomerService = {
  getCustomersMedium() {
    return new Promise((resolve) => {
      resolve([
        {
          training_id: 1,
          trainer_name: "John Doe",
          start_date: "2024-01-01",
          end_date: "2024-01-10",
          status: "completed",
        },
        {
          training_id: 2,
          trainer_name: "Jane Smith",
          start_date: "2024-02-15",
          end_date: "2024-02-25",
          status: "ongoing",
        },
      ]);
    });
  },
  // Mock API to fetch users
  getUsers() {
    return new Promise((resolve) => {
      resolve([
        { _id: 1, username: "John Doe", role: "trainer" },
        { _id: 2, username: "Jane Smith", role: "trainer" },
        { _id: 3, username: "Mike Johnson", role: "user" },
        { _id: 4, username: "Anna Davis", role: "user" },
      ]);
    });
  },
};

export default function Training() {
  const [trainings, setTrainings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState("");
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: "contains" },
    trainer_name: { value: null, matchMode: "startsWith" },
    start_date: { value: null, matchMode: "dateIs" },
    end_date: { value: null, matchMode: "dateIs" },
    status: { value: null, matchMode: "equals" },
  });

  const [visible, setVisible] = useState(false); // Dialog visibility
  const [newTraining, setNewTraining] = useState({
    trainer: null,
    participants: [],
    start_date: null,
    end_date: null,
    status: "completed", // Default value for status
  });

  const [users, setUsers] = useState([]); // State to hold users
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

    // Fetch users to populate trainer and participants dropdown
    CustomerService.getUsers().then(setUsers);
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
            style={{ paddingLeft: "2em" }} // Add padding to the left for the icon
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
          onClick={() => setVisible(true)} // Open dialog on click
        />
      </div>
    </div>
  );

  const handleDialogSubmit = async () => {
    try {
      console.log(newTraining.participants);
      const response = await axios.post('http://localhost:8080/training/', { // Update the URL as necessary
        trainer: newTraining.trainer,
        participants: newTraining.participants,
        start_date: newTraining.start_date,
        end_date: newTraining.end_date,
        status: newTraining.status,
      });

      console.log('Training Created:', response.data);

      // Optionally update state or refresh the list of trainings
      setTrainings([...trainings, { ...newTraining, training_id: trainings.length + 1 }]); // Adjust if you get an ID from the backend
      setVisible(false);
      setNewTraining({
        trainer: null,
        participants: [],
        start_date: null,
        end_date: null,
        status: "completed",
      });
    } catch (error) {
      console.error('Error adding training session:', error.response ? error.response.data : error.message);
    }
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
          dataKey="training_id"
          filters={filters}
          globalFilter={globalFilter}
          header={header}
          loading={loading}
          emptyMessage="No trainings found."
        >
          <Column field="trainer_name" header="Trainer Name" sortable />
          <Column field="start_date" header="Start Date" body={formatDate} sortable />
          <Column field="end_date" header="End Date" body={formatDate} sortable />
          <Column field="status" header="Status" body={statusBodyTemplate} sortable />
          <Column body={detailsBodyTemplate} headerStyle={{ width: "8rem" }} />
        </DataTable>
      </div>

      <Dialog
        header="Add Training Session"
        visible={visible}
        onHide={() => setVisible(false)}
        footer={dialogFooter}
        style={{ width: "40vw" }}
      >
        <div className="p-grid p-fluid">
          <div className="p-field">
            <label htmlFor="trainer">Trainer</label>
            <Dropdown
              id="trainer"
              value={newTraining.trainer}
              options={trainerOptions}
              onChange={(e) => setNewTraining({ ...newTraining, trainer: e.value })}
              placeholder="Select a Trainer"
            />
          </div>
          <div className="p-field">
            <label htmlFor="participants">Participants</label>
            <MultiSelect
              id="participants"
              value={newTraining.participants}
              options={participantOptions}
              onChange={(e) => setNewTraining({ ...newTraining, participants: e.value })}
              placeholder="Select Participants"
            />
          </div>
          <div className="p-field">
            <label htmlFor="start_date">Start Date</label>
            <Calendar
              id="start_date"
              value={newTraining.start_date}
              onChange={(e) => setNewTraining({ ...newTraining, start_date: e.value })}
              placeholder="Select Start Date"
            />
          </div>
          <div className="p-field">
            <label htmlFor="end_date">End Date</label>
            <Calendar
              id="end_date"
              value={newTraining.end_date}
              onChange={(e) => setNewTraining({ ...newTraining, end_date: e.value })}
              placeholder="Select End Date"
            />
          </div>
          <div className="p-field">
            <label htmlFor="status">Status</label>
            <Dropdown
              id="status"
              value={newTraining.status}
              options={statuses}
              onChange={(e) => setNewTraining({ ...newTraining, status: e.value })}
              placeholder="Select Status"
            />
          </div>
        </div>
      </Dialog>
    </>
  );
}
