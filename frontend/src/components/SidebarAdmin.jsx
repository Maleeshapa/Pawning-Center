import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Sidebar.css';
import config from '../config';

const SidebarAdmin = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await fetch(`${config.BASE_URL}/api/logout`, {
                method: 'POST',
                credentials: 'include',
            });
            navigate('/Login');
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };
    return (
        <div className="sidebar bg-dark text-white">
            <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 min-vh-100 center">
                <div className="sidebar-center">
                    <NavLink to="/DashboardAdmin" className="d-flex align-items-center pb-3 mb-md-0 me-md-auto text-white text-decoration-none">
                        <span className="caption">Admin</span>
                    </NavLink>

                    <ul className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm">
                        <li className="nav-item">
                            <NavLink to="/DashboardAdmin" className={({ isActive }) => "btn navlink align-middle px-3 mb-4 " + (isActive ? "active" : "")}>
                                <i className="fs-4 bi-house"></i>
                                <span className="ms-1 d-none d-sm-inline">Dashboard</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/CustomersAdmin" className={({ isActive }) => "btn navlink px-3 align-middle mb-4 " + (isActive ? "active" : "")}>
                                <i className="fs-4 bi bi-person-vcard-fill"></i>
                                <span className="ms-1 d-none d-sm-inline">Customers</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/ProductsAdmin" className={({ isActive }) => "navlink btn px-3 align-middle mb-4 " + (isActive ? "active" : "")}>
                                <i className="fs-4 bi-grid"></i>
                                <span className="ms-1 d-none d-sm-inline">Products</span>
                            </NavLink>
                        </li>

                        {/* <li>
                        <NavLink to="/InterestAdmin" className={({ isActive }) => "navlink btn px-3 align-middle mb-4 " + (isActive ? "active" : "")}>
                            <i className="fs-4 bi bi-currency-exchange"></i>
                            <span className="ms-1 d-none d-sm-inline">Interest</span>
                        </NavLink>
                    </li> */}
                        {/* <li>
                        <NavLink to="/CreateAdmin" className={({ isActive }) => "navlink btn px-3 align-middle mb-4 " + (isActive ? "active" : "")}>
                            <i className="fs-4 bi bi-person-plus"></i>
                            <span className="ms-1 d-none d-sm-inline">Create Admin</span>
                        </NavLink>
                    </li> 
                    <li>
                        <NavLink to="/ProfileAdmin" className={({ isActive }) => "navlink btn px-3 align-middle mb-4 " + (isActive ? "active" : "")}>
                            <i className="fs-4 bi bi-gear"></i>
                            <span className="ms-1 d-none d-sm-inline">Settings</span>
                        </NavLink>
                    </li>*/}
                        <hr />
                        <li>
                            <NavLink onClick={handleLogout} className="logout">
                                <span className="">Log out</span>
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default SidebarAdmin;
