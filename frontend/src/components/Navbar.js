import "./Navbar.css";
import { NavLink } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { logout, getCurrentUser } from "../services/authService";
import ChangePasswordModal from "./ChangePasswordModal";

function Navbar() {

    const user = getCurrentUser();
    const [showMenu, setShowMenu] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const menuRef = useRef(null);

    const handleLogout = () => {

        setShowMenu(false);

        logout();

        window.location.href = "/login";

    };

    useEffect(() => {

    const handleClickOutside = (event) => {

        if (
            menuRef.current &&
            !menuRef.current.contains(event.target)
        ) {
            setShowMenu(false);
        }

    };

    document.addEventListener(
        "mousedown",
        handleClickOutside
    );

    return () => {

        document.removeEventListener(
            "mousedown",
            handleClickOutside
        );

    };

}, []);

    const navLinkStyle = ({ isActive }) => ({

        textDecoration: "none",

        fontWeight: "600",

        padding: "8px 14px",

        borderRadius: "8px",

        color: isActive ? "#0D6EFD" : "#333",

        backgroundColor: isActive ? "#E3F0FF" : "transparent",

        border: isActive ? "1px solid #C9DFFF" : "1px solid transparent",

        transition: "all 0.25s ease"

    });

    return (

        <header className="navbar">

            <div className="navbar-left">

                <div className="logo-box">

                    📦

                </div>

                <div>

                    <h1>Inventra </h1>

                    <p>Smart Inventory Management</p>

                </div>

            </div>

            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "20px"
                }}
            >

                <NavLink
                    to="/"
                    end
                    style={navLinkStyle}
                >
                    Dashboard
                </NavLink>

                {

                    user?.role === "ADMIN" && (

                        <NavLink
                            to="/users"
                            style={navLinkStyle}
                        >
                            Users
                        </NavLink>

                    )

                }

                <div
    ref={menuRef}           
    style={{
        position: "relative"
    }}
>

    <button
        onClick={() => setShowMenu(!showMenu)}
        style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "600"
        }}
    >

        Welcome, <b>{user?.username}</b> ▼

    </button>

    {

        showMenu &&

        <div
            style={{
                position: "absolute",
                top: "42px",
                right: "0",
                width: "190px",
                background: "#fff",
                border: "1px solid #ddd",
                borderRadius: "10px",
                boxShadow: "0 5px 15px rgba(0,0,0,0.15)",
                overflow: "hidden",
                zIndex: 1000
            }}
        >

            <button
    onClick={() => {

        setShowPasswordModal(true);

        setShowMenu(false);

    }}
    style={{
        width: "100%",
        padding: "12px",
        border: "none",
        background: "white",
        cursor: "pointer",
        textAlign: "left"
    }}
>

    Change Password

</button>

            <button
                onClick={handleLogout}
                style={{
                    width: "100%",
                    padding: "12px",
                    border: "none",
                    background: "white",
                    cursor: "pointer",
                    textAlign: "left",
                    color: "red"
                }}
            >

                Logout

            </button>

        </div>

    }

</div>

            </div>


            <ChangePasswordModal
    show={showPasswordModal}
    onClose={() => setShowPasswordModal(false)}
/>

        </header>

    );

}

export default Navbar;