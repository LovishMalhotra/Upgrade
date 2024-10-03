import React from 'react';
import { Menubar } from 'primereact/menubar';
import { InputText } from 'primereact/inputtext';
import { Badge } from 'primereact/badge';
import { Avatar } from 'primereact/avatar';  
import { useNavigate } from 'react-router-dom';

export default function TemplateDemo() {
    const navigate = useNavigate();

    const itemRenderer = (item) => (
        <div 
            className="flex align-items-center p-menuitem-link"
            onClick={() => {
                if (item.label === 'Training') {
                    navigate('/training');
                } else if (item.label === 'Home') {
                    navigate('/');
                }  else if (item.label === 'Employee') {
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

    const items = [
        {
            label: 'Home',
            icon: 'pi pi-home',
            template: itemRenderer // Add template here if needed
        },
        {
            label: 'Training',
            icon: 'pi pi-calendar',
            template: itemRenderer // Add template here
        },
        {
            label: 'Employee',
            icon: 'pi pi-user-plus',
            template: itemRenderer
        },
        {
            label: 'Contact',
            icon: 'pi pi-envelope',
            badge: 3,
            template: itemRenderer 
        }
    ];

    const start = <img alt="logo" src="https://primefaces.org/cdn/primereact/images/logo.png" height="40" className="mr-2"></img>;
    const end = (
        <div className="d-flex align-items-center ">
            <InputText placeholder="Search" type="text" className="mx-5" />
            <Avatar image="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png" shape="circle" className='mx-2 ' />
        </div>
    );

    return (
        <div className="card m-3 p-1">
            <Menubar model={items} start={start} end={end}  className="custom-menubar" />
        </div>
    );
}
