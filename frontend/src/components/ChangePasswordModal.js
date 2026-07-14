import { useState } from "react";
import { toast } from "react-toastify";
import api from "../services/api";
import "./ChangePasswordModal.css";

function ChangePasswordModal({ show, onClose }) {

    const [form, setForm] = useState({
        current_password: "",
        new_password: "",
        confirm_password: ""
    });

    if (!show) return null;

    const handleChange = (e) => {

        setForm({
            ...form,
            [e.target.name]: e.target.value
        });

    };

    const updatePassword = async () => {

        if (
            !form.current_password ||
            !form.new_password ||
            !form.confirm_password
        ) {

            toast.warning("Please fill all fields.");

            return;

        }

        if (
            form.new_password !==
            form.confirm_password
        ) {

            toast.error("Passwords do not match.");

            return;

        }
        if (form.new_password.length < 6) {

    toast.warning(
        "Password must contain at least 6 characters."
    );

    return;

}

if (
    form.current_password ===
    form.new_password
) {

    toast.warning(
        "New password must be different from the current password."
    );

    return;

}

        try {

            await api.put(
                "/users/me/change-password",
                {
                    current_password: form.current_password,
                    new_password: form.new_password
                }
            );

            toast.success(
                "Password Updated Successfully."
            );

            setForm({
                current_password: "",
                new_password: "",
                confirm_password: ""
            });

            onClose();

toast.success(
    "Password changed successfully. Please login again."
);

localStorage.removeItem("inventory_token");

setTimeout(() => {

    window.location.href = "/login";

}, 1500);

        }

        catch (err) {

            toast.error(
                err.response?.data?.detail ||
                "Unable to update password."
            );

        }

    };

    return (

        <div className="modal-overlay">

            <div className="modal-content">

                <h2>

                    Change Password

                </h2>

                <input
                    type="password"
                    name="current_password"
                    placeholder="Current Password"
                    value={form.current_password}
                    onChange={handleChange}
                />

                <input
                    type="password"
                    name="new_password"
                    placeholder="New Password"
                    value={form.new_password}
                    onChange={handleChange}
                />

                <input
                    type="password"
                    name="confirm_password"
                    placeholder="Confirm Password"
                    value={form.confirm_password}
                    onChange={handleChange}
                />

                <div className="modal-actions">
                

                    <button
    className="cancel-btn"
    onClick={() => {

        setForm({
            current_password: "",
            new_password: "",
            confirm_password: ""
        });

        onClose();

    }}
>

                        Cancel

                    </button>

                    <button
                        className="update-btn"
                        onClick={updatePassword}
                    >

                        Update

                    </button>

                </div>

            </div>

        </div>

    );

}

export default ChangePasswordModal;