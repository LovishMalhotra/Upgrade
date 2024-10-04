import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import axios from "axios";
import { Card } from "primereact/card";
import Navbar from './Navbar';

const UserForm = () => {
    const [userData, setUserData] = useState({
        username: "",
        email: "",
        password: "",
        role: "user", // Default role
        designation: "",
    });

    const roles = [
        { label: "Admin", value: "admin" },
        { label: "Trainer", value: "trainer" },
        { label: "User", value: "user" },
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleDropdownChange = (e) => {
        setUserData((prevData) => ({
            ...prevData,
            role: e.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Send user data to the backend
            const response = await axios.post("http://localhost:8080/users", userData);
            console.log("User created successfully:", response.data);
           
            // Reset form state
            setUserData({
                username: "",
                email: "",
                password: "",
                role: "user",
                designation: "",
            });
        } catch (error) {
            console.error("Error creating user:", error);
        }
    };

    const dialogFooter = (
        <div className="d-flex justify-content-end">
            <Button
                label="Cancel"
                icon="pi pi-times"
                className="p-button-text p-button-secondary me-2"
            />
            <Button
                label="Submit"
                icon="pi pi-check"
                onClick={handleSubmit}
                className="p-button-text p-button-primary"
            />
        </div>
    );

    const header = () =>{
        <h3>Training Sessions</h3>
    }

    return (
        <>
        <Navbar />
        <div className="d-flex justify-content-center align-items-center min-h-screen m-5">
            <Card
                header={header}
                footer={dialogFooter}
                style={{ width: "50%", padding: "2rem" }} // Added padding for better spacing
            >
                <div className="field mb-3">
                    <label htmlFor="username">Username</label>
                    <InputText
                        id="username"
                        name="username"
                        value={userData.username}
                        onChange={handleChange}
                        required
                        placeholder="Enter Username"
                        className="w-full"
                    />
                </div>

                <div className="field mb-3">
                    <label htmlFor="email">Email</label>
                    <InputText
                        id="email"
                        name="email"
                        value={userData.email}
                        onChange={handleChange}
                        required
                        placeholder="Enter Email"
                        className="w-full"
                    />
                </div>

                <div className="field mb-3">
                    <label htmlFor="password">Password</label>
                    <InputText
                        id="password"
                        name="password"
                        type="password"
                        value={userData.password}
                        onChange={handleChange}
                        required
                        placeholder="Enter Password"
                        className="w-full"
                    />
                </div>

                <div className="field mb-3">
                    <label htmlFor="role">Role</label>
                    <Dropdown
                        id="role"
                        value={userData.role}
                        options={roles}
                        onChange={handleDropdownChange}
                        placeholder="Select a Role"
                        className="w-full"
                    />
                </div>

                <div className="field mb-3">
                    <label htmlFor="designation">Designation</label>
                    <InputText
                        id="designation"
                        name="designation"
                        value={userData.designation}
                        onChange={handleChange}
                        placeholder="Enter Designation"
                        className="w-full"
                    />
                </div>
            </Card>
        </div>
        </>
    );
};

export default UserForm;
