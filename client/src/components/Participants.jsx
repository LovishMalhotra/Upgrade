import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";
import { useParams } from "react-router-dom";
import Navbar from "./Navbar";
import axios from "axios";
import { useUser } from './UserContext'; 

export default function Participants() {
  const { userRole } = useUser(); 
  const { training_code } = useParams();
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [globalFilter, setGlobalFilter] = useState("");
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: "contains" },
    participant_name: { value: null, matchMode: "startsWith" },
  });

  // State for the remarks dialog
  const [visibleRemarksDialog, setVisibleRemarksDialog] = useState(false);

  // State for the edit dialog
  const [visibleEditDialog, setVisibleEditDialog] = useState(false);

  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [newRemark, setNewRemark] = useState("");

  // Edit scores state
  const [editScores, setEditScores] = useState({
    hackerrank_score: 0,
    assessment_score: 0,
    performance: 0,
    communication: 0,
  });

  const fetchParticipants = () => {
    setLoading(true);
    
    axios
      .get(`http://localhost:8080/training/${training_code}`) // Use training_code in the API endpoint
      .then((response) => {
        const allParticipants = response.data.participants.map((participant) => ({
          ...participant,
          training_code: response.data.training_code, // Assuming training_code comes from the response
          status: response.data.status,
          trainer: response.data.trainer.username, // Get trainer's username
        }));
        setParticipants(allParticipants);
      })
      .catch((error) => {
        console.error("Error fetching participants:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    
    fetchParticipants()
  }, [training_code]);

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };
    _filters["global"].value = value;
    setFilters(_filters);
    setGlobalFilter(value);
  };

  // Format score display
  const scoreBodyTemplate = (rowData, field) => {
    return rowData[field] != null ? rowData[field].toFixed(1) : "N/A";
  };

  const remarksBodyTemplate = (rowData) => {
    return (
      <Button
        label="Remarks"
        icon="pi pi-comment"
        className="p-button-text"
        onClick={() => openRemarksDialog(rowData)}
      />
    );
  };

  const openRemarksDialog = (rowData) => {
    setSelectedParticipant(rowData);
    setNewRemark(rowData.remarks || ""); // Use remarks from participant
    setVisibleEditDialog(false); // Close edit dialog if open
    setVisibleRemarksDialog(true); // Open remarks dialog
  };

  const openEditDialog = (rowData) => {
    setSelectedParticipant(rowData);
    setEditScores({
      hackerRankScore: rowData.hackerRankScore || 0,
      assessmentScore: rowData.assessmentScore || 0,
      performance: rowData.performance || 0,
      communication: rowData.communication || 0,
      remarks: rowData.remarks || "",
    });
    console.log("Editing participant:", rowData); // Log selected participant data
    setVisibleEditDialog(true);
  };

  const handleEditDialogSubmit = () => {
    if (selectedParticipant) {
      // Prepare the data for the PUT request
      const updatedData = {
        hackerRankScore: editScores.hackerRankScore,
        assessmentScore: editScores.assessmentScore,
        performance: editScores.performance,
        communication: editScores.communication,
        remarks: editScores.remarks || newRemark,
      };
      console.log(updatedData);
  
      // Set loading to true
      setLoading(true);
  
      // Send the updated scores and remarks to the server
      axios
        .put(
          `http://localhost:8080/training/${selectedParticipant.training_code}/participants/${selectedParticipant._id}`,
          updatedData
        )
        .then((response) => {
          console.log("Participant updated successfully:", response.data);
  
          // Optionally, update the local state to reflect changes immediately
          // This is not strictly necessary if you are going to reload the data.
          setParticipants((prevParticipants) =>
            prevParticipants.map((participant) =>
              participant._id === selectedParticipant._id
                ? { ...participant, ...response.data } // Update the specific participant
                : participant
            )
          );
  
          // Now, reload the participants data after a short delay
          setTimeout(() => {
            fetchParticipants(); // Fetch the updated participant data from the server
          }, 500); // Delay for half a second (adjust as needed)
  
          // Close the edit dialog
          setVisibleEditDialog(false);
        })
        .catch((error) => {
          console.error(
            "Error updating participant:",
            error.response ? error.response.data : error.message
          );
        })
        .finally(() => {
          // Reset loading state
          setLoading(false);
        });
    }
  };
  
  
  

  const handleDialogSubmit = () => {
    if (selectedParticipant) {
      // Update the remarks for the selected participant
      const updatedParticipants = participants.map((p) =>
        p._id === selectedParticipant._id ? { ...p, remarks: newRemark } : p
      );
      setParticipants(updatedParticipants);
    }
    setVisibleRemarksDialog(false);
  };

  const dialogFooter = (
    <div>
      <Button
        label="Cancel"
        icon="pi pi-times"
        onClick={() => setVisibleRemarksDialog(false)}
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

  const editDialogFooter = (
    <div>
      <Button
        label="Cancel"
        icon="pi pi-times"
        onClick={() => setVisibleEditDialog(false)}
        className="p-button-text p-button-secondary me-2"
      />
      <Button
        label="Submit"
        icon="pi pi-check"
        onClick={handleEditDialogSubmit}
        className="p-button-text p-button-primary"
      />
    </div>
  );

  const header = (
    <div className="d-flex justify-content-between align-items-center mb-4">
      <h3>Participant Scores</h3>
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
      </div>
    </div>
  );

  return (
    <>
      <Navbar />

      <div className="card m-5">
        <DataTable
          value={participants}
          paginator
          rows={10}
          dataKey="_id" // Unique field for dataKey
          loading={loading}
          globalFilterFields={[
            "user.username",
            "user.email",
            "user.designation",
            "hackerRankScore",
            "assessmentScre",
            "performanoce",
            "communication",
          ]}
          globalFilter={globalFilter}
          header={header}
          emptyMessage="No participants found."
          className="p-datatable-gridlines"
        >
          <Column
            field="user.username"
            header="Participant Name"
            sortable
            style={{ minWidth: "10rem" }}
          />
          <Column
            field="user.email"
            header="Email"
            sortable
            style={{ minWidth: "10rem" }}
          />
          <Column
            field="user.designation"
            header="Designation"
            sortable
            style={{ minWidth: "10rem" }}
          />
          <Column
            field="hackerRankScore"
            header="HackerRank Score"
            body={(rowData) => scoreBodyTemplate(rowData, "hackerRankScore")}
            sortable
            style={{ minWidth: "10rem" }}
          />
          <Column
            field="assessmentScore"
            header="Assessment Score"
            body={(rowData) => scoreBodyTemplate(rowData, "assessmentScore")}
            sortable
            style={{ minWidth: "10rem" }}
          />
          <Column
            field="performance"
            header="Performance"
            body={(rowData) => scoreBodyTemplate(rowData, "performance")}
            sortable
            style={{ minWidth: "10rem" }}
          />
          <Column
            field="communication"
            header="Communication"
            body={(rowData) => scoreBodyTemplate(rowData, "communication")}
            sortable
            style={{ minWidth: "10rem" }}
          />
          <Column
            header="Remarks"
            body={remarksBodyTemplate}
            style={{ minWidth: "10rem" }}
          />
          {userRole === 'trainer' && (
            <Column
            header="Edit"
            body={(rowData) => (
              <Button
                label="Edit"
                icon="pi pi-pencil"
                className="p-button-text"
                onClick={() => openEditDialog(rowData)}
              />
            )}
            style={{ minWidth: "10rem" }}
          />
        )}
          
        </DataTable>
      </div>

      {/* Dialog for adding/updating remarks */}
      <Dialog
        header={`Remarks for ${selectedParticipant?.user?.username || ""}`}
        visible={visibleRemarksDialog}
        onHide={() => setVisibleRemarksDialog(false)}
        style={{ width: "50%" }}
      >
        {/* Display remarks as styled text */}
        <div className="field mb-3">
          <label
            htmlFor="remarks"
            style={{ fontWeight: "bold", fontSize: "1.1rem" }}
          >
            Remarks
          </label>
          <div
            id="remarks"
            style={{
              backgroundColor: "#f5f5f5",
              padding: "1rem",
              borderRadius: "5px",
              border: "1px solid #ddd",
              minHeight: "5rem",
              whiteSpace: "pre-wrap", // Keeps line breaks
              fontSize: "1rem",
              color: "#333",
            }}
          >
            {selectedParticipant?.remarks || "No remarks available."}
          </div>
        </div>
      </Dialog>

      {/* Dialog for editing scores */}
      <Dialog
        header={`Edit Scores for ${selectedParticipant?.user?.username || ""}`}
        visible={visibleEditDialog}
        footer={editDialogFooter}
        onHide={() => setVisibleEditDialog(false)}
        style={{ width: "50%" }}
      >
        {/* Existing fields for scores */}
        <div className="field mb-3">
          <label htmlFor="hackerrank_score">HackerRank Score</label>
          <InputText
            id="hackerRankScore"
            value={editScores.hackerRankScore || ""} // Ensure value matches backend field
            onChange={(e) =>
              setEditScores({
                ...editScores,
                hackerRankScore:
                  e.target.value === ""
                    ? ""
                    : Math.min(Math.max(parseFloat(e.target.value), 0), 10),
              })
            }
            placeholder="0 to 10"
            type="number"
            min="0"
            max="10"
            step="1"
            className="w-full"
          />
        </div>
        <div className="field mb-3">
          <label htmlFor="assessment_score">Assessment Score</label>
          <InputText
            id="assessmentScore"
            value={editScores.assessmentScore || ""} // Ensure value matches backend field
            onChange={(e) =>
              setEditScores({
                ...editScores,
                assessmentScore:
                  e.target.value === ""
                    ? ""
                    : Math.min(Math.max(parseFloat(e.target.value), 0), 10),
              })
            }
            placeholder="0 to 10"
            type="number"
            min="0"
            max="10"
            step="1"
            className="w-full"
          />
        </div>
        <div className="field mb-3">
          <label htmlFor="performance">Performance Score</label>
          <InputText
            id="performance"
            value={editScores.performance}
            onChange={(e) =>
              setEditScores({
                ...editScores,
                performance: Math.min(
                  Math.max(parseFloat(e.target.value), 0),
                  10
                ),
              })
            }
            placeholder="0 to 10"
            type="number"
            min="0"
            max="10"
            step="1"
            className="w-full"
          />
        </div>
        <div className="field mb-3">
          <label htmlFor="communication">Communication Score</label>
          <InputText
            id="communication"
            value={editScores.communication}
            onChange={(e) =>
              setEditScores({
                ...editScores,
                communication: Math.min(
                  Math.max(parseFloat(e.target.value), 0),
                  10
                ),
              })
            }
            placeholder="0 to 10"
            type="number"
            min="0"
            max="10"
            step="1"
            className="w-full"
          />
        </div>

        {/* New Remarks Field */}
        <div className="field mb-3">
          <label htmlFor="remarks">Remarks</label>
          <InputText
            id="remarks"
            value={editScores.remarks || selectedParticipant?.remarks || ""}
            onChange={(e) =>
              setEditScores({
                ...editScores,
                remarks: e.target.value,
              })
            }
            placeholder="Enter remarks"
            className="w-full"
          />
        </div>
      </Dialog>
    </>
  );
}
