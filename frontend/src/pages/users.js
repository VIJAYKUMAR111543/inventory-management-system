import { useEffect, useState } from "react";

import api from "../services/api";
import Navbar from "../components/Navbar";

import UserForm from "../components/UserForm";
import UserTable from "../components/UserTable";

import { toast } from "react-toastify";

function Users() {

    const [users, setUsers] = useState([]);

    const [selectedUser, setSelectedUser] = useState(null);

    const loadUsers = async () => {

        try {

            const response = await api.get("/users");

            setUsers(response.data);

        }

        catch (err) {

            console.log(err);

            toast.error("Unable to load users.");

        }

    };

    useEffect(() => {

        loadUsers();

    }, []);

   return (

    <>

        <Navbar />

        <div className="app-container">

            <div className="dashboard-header">

                <div>

                    <h2>User Management</h2>

                    <p>

                        Create, update and manage system users.

                    </p>

                </div>

            </div>

            <div className="main-content">

                <div className="left-side">

                    <UserForm
                        reloadUsers={loadUsers}
                        selectedUser={selectedUser}
                        setSelectedUser={setSelectedUser}
                    />

                    <UserTable
                        users={users}
                        reloadUsers={loadUsers}
                        setSelectedUser={setSelectedUser}
                    />

                </div>

            </div>

        </div>

    </>

);

}

export default Users;