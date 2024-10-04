import React from 'react';
import { Menubar } from 'primereact/menubar';
import { InputText } from 'primereact/inputtext';
import { Badge } from 'primereact/badge';
import { Avatar } from 'primereact/avatar';
import { Tooltip } from 'primereact/tooltip'; // Import Tooltip
import { useNavigate } from 'react-router-dom';
import { useUser } from './UserContext'; // Assuming you have a UserContext to manage user roles

export default function TemplateDemo() {
    const navigate = useNavigate();
    const { userRole } = useUser(); // Get the user role from context

    const itemRenderer = (item) => (
        <div
            className="flex align-items-center p-menuitem-link"
            onClick={() => {
                if (item.label === 'Training') {
                    navigate('/training');
                } else if (item.label === 'Home') {
                    navigate('/');
                } else if (item.label === 'Employee') {
                    navigate('/register');
                }
            }}
            style={{ cursor: 'pointer' }} // Optional: to indicate that it's clickable
        >
            <span className={item.icon} />
            <span className="mx-2">{item.label}</span>
            {item.badge && <Badge className="ml-auto" value={item.badge} />}
            {item.shortcut && <span className="ml-auto border-1 surface-border border-round surface-100 text-xs p-1">{item.shortcut}</span>}
        </div>
    );

    // Define the menu items
    const items = [
        {
            label: 'Home',
            icon: 'pi pi-home',
            template: itemRenderer
        },
        {
            label: 'Training',
            icon: 'pi pi-calendar',
            template: itemRenderer
        },
        // Render the Employee menu item only if the user is an admin
        ...(userRole === 'admin' ? [{
            label: 'Employee',
            icon: 'pi pi-user-plus',
            template: itemRenderer
        }] : []),
        {
            label: 'Contact',
            icon: 'pi pi-envelope',
            badge: 3,
            template: itemRenderer
        }
    ];

    const start = <img alt="logo" src="https://primefaces.org/cdn/primereact/images/logo.png" height="40" className="mr-2"></img>;
    const end = (
        <div className="d-flex align-items-center">
            <InputText placeholder="Search" type="text" className="mx-5" />
            <div className="avatar-container" style={{ cursor: 'pointer' }}>
                {/* Add the tooltip directly to the avatar */}
                <Avatar
                    image="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png"
                    shape="circle"
                    className="mx-2"
                    onClick={() => navigate('/login')} // Click to navigate to login
                    data-pr-tooltip="No notifications" // Tooltip message
                    data-pr-position="right" // Position of the tooltip
                />
                <Tooltip target=".avatar-container" />
            </div>
        </div>
    );

    return (
        <div className="card m-3 p-1">
            <Menubar model={items} start={start} end={end} className="custom-menubar" />
        </div>
    );
}
