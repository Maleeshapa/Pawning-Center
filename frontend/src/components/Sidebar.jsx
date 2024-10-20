import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Sidebar.css';
import config from '../config';

const Sidebar = () => {
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
                    <NavLink to="/Dashboard" className="d-flex align-items-center pb-3 mb-md-0 me-md-auto text-white text-decoration-none">
                        <span className="caption">හිමිකරු</span>
                    </NavLink>

                    <ul className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm">
                        <li className="nav-item">
                            <NavLink to="/Dashboard" className={({ isActive }) => "btn navlink align-middle px-3 mb-4 " + (isActive ? "active" : "")}>
                                <i className="fs-4 bi-house"></i>
                                <span className="ms-1 d-none d-sm-inline">Dashboard</span>
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/Customers" className={({ isActive }) => "btn navlink px-3 align-middle mb-4 " + (isActive ? "active" : "")}>
                                <i className="fs-4 bi bi-person-vcard-fill"></i>
                                <span className="ms-1 d-none d-sm-inline">පාරිභොගිකයා</span>
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/Products" className={({ isActive }) => "navlink btn px-3 align-middle mb-4 " + (isActive ? "active" : "")}>
                                <i className="fs-4 bi-grid"></i>
                                <span className="ms-1 d-none d-sm-inline">ගනුදෙනු විස්තර</span>
                            </NavLink>
                        </li>

                        {/* <li className="nav-item">
                        <NavLink to="/Interest" className={({ isActive }) => "navlink btn px-3 align-middle mb-4 " + (isActive ? "active" : "")}>
                            <i className="fs-4 bi bi-currency-exchange"></i>
                            <span className="ms-1 d-none d-sm-inline">Interest</span>
                        </NavLink>
                    </li> */}

                        <li className="nav-item">
                            <NavLink to="/Pawn" className={({ isActive }) => "navlink btn px-3 align-middle mb-4 " + (isActive ? "active" : "")}>
                                <i class="fs-4 bi bi-wallet2"></i>
                                <span className="ms-1 d-none d-sm-inline">උකස් ඉතිහාසය</span>
                            </NavLink>
                        </li>

                        <li className="nav-item">
                            <NavLink to="/Sell" className={({ isActive }) => "navlink btn px-3 align-middle mb-4 " + (isActive ? "active" : "")}>
                                <i className="fs-4 bi bi-coin"></i>
                                <span className="ms-1 d-none d-sm-inline">විකුනුම් ඉතිහාසය</span>
                            </NavLink>
                        </li>

                        <li className="nav-item">
                            <NavLink to="/Remove" className={({ isActive }) => "navlink btn px-3 align-middle mb-4 " + (isActive ? "active" : "")}>
                                <i className="fs-4 bi bi-trash"></i>
                                <span className="ms-1 d-none d-sm-inline">ඉවත්කල භාන්ඩ</span>
                            </NavLink>
                        </li>

                        <li className="nav-item">
                            <NavLink to="/item" className={({ isActive }) => "navlink btn px-3 align-middle mb-4 " + (isActive ? "active" : "")}>
                                <i class="fs-4 bi bi-plus-circle"></i>
                                <span className="ms-1 d-none d-sm-inline">නව අයිතම</span>
                            </NavLink>
                        </li>

                        <li className="nav-item">
                            <NavLink to="/CreateAdmin" className={({ isActive }) => "navlink btn px-3 align-middle mb-4 " + (isActive ? "active" : "")}>
                                <i className="fs-4 bi bi-person-plus"></i>
                                <span className="ms-1 d-none d-sm-inline">Create Admin</span>
                            </NavLink>
                        </li>

                        {/* <li className="nav-item">
                            <NavLink to="/Report" className={({ isActive }) => "navlink btn px-3 align-middle mb-4 " + (isActive ? "active" : "")}>
                                <i className="fs-4 bi bi-gear"></i>
                                <span className="ms-1 d-none d-sm-inline">Report</span>
                            </NavLink>
                        </li> */}
                        <hr />
                        <li className="nav-item">
                            <NavLink onClick={handleLogout} className="logout">
                                <span className="">ඉවත්වන්න</span>
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
