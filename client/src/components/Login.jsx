import React, { useState, useRef } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import axios from "axios";
import { Card } from "primereact/card";
import Navbar from './Navbar';
import { useUser } from './UserContext'; 
import { Toast } from 'primereact/toast';
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
    const navigate = useNavigate();
    const { setUserRole,setUserId } = useUser(); 
    
    const [credentials, setCredentials] = useState({
        email: "",
        password: "",
        role: "", // New field for role
    });
    const [error, setError] = useState(null);
    const toast = useRef(null); // Reference for toast notification

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null); // Reset error on new attempt
        try {
            // Sending credentials to the backend for login
            const response = await axios.post("http://localhost:8080/users/login", credentials);
            const role = response.data.user.role;
            const id = response.data.user.email;
            console.log(response.data.user.email);
            setUserRole(role); // Set user role in context
            setUserId(id);

            // Show success message
            toast.current.show({ severity: 'success', summary: 'Login Successful', detail: `Welcome ${role}` });

            setTimeout(() => {
                navigate('/'); // Navigate to the home page
            }, 2000); 
        } catch (error) {
            console.error("Login error:", error);
            setError("Invalid email or password.");
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
                label="Login"
                icon="pi pi-check"
                onClick={handleSubmit}
                className="p-button-text p-button-primary"
            />
        </div>
    );

    const header = (
        <h3>Trainer/Admin Login</h3>
    );

    return (
        <>
        <Navbar />
        <div className="d-flex justify-content-center align-items-center min-h-screen m-5">
            <Card
                header={header}
                footer={dialogFooter}
                style={{ width: "50%", padding: "2rem" }} // Added padding for better spacing
            >
                {error && (
                    <div className="alert alert-danger" role="alert">
                        {error}
                    </div>
                )}

                <div className="field mb-3">
                    <label htmlFor="email">Email</label>
                    <InputText
                        id="email"
                        name="email"
                        value={credentials.email}
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
                        value={credentials.password}
                        onChange={handleChange}
                        required
                        placeholder="Enter Password"
                        className="w-full"
                    />
                </div>
            </Card>
            <Toast ref={toast} /> {/* Ensure Toast is included here */}
        </div>
        </>
    );
};

export default LoginForm;
