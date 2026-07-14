import { useState, useEffect } from "react";
import { toast } from "react-toastify";

import api from "../services/api";

function UserForm({

    reloadUsers,

    selectedUser,

    setSelectedUser

}) {

    const [user, setUser] = useState({

        username: "",

        email: "",

        password: "",

        role: "EMPLOYEE"

    });

    useEffect(() => {

        if (selectedUser) {

            setUser({

                username: selectedUser.username,

                email: selectedUser.email,

                password: "",

                role: selectedUser.role

            });

        }

        else {

            setUser({

                username: "",

                email: "",

                password: "",

                role: "EMPLOYEE"

            });

        }

    }, [selectedUser]);



    const handleChange = (e) => {

        setUser({

            ...user,

            [e.target.name]: e.target.value

        });

    };



    const saveUser = async () => {

        if (!user.username.trim()) {

            toast.warning("Enter Username");

            return;

        }

        if (!user.email.trim()) {

            toast.warning("Enter Email");

            return;

        }

        if (!selectedUser && !user.password.trim()) {

            toast.warning("Enter Password");

            return;

        }

        try {

            if (selectedUser) {

                await api.put(

                    `/users/${selectedUser.id}`,

                    {

                        username: user.username,

                        email: user.email,

                        role: user.role,

                        is_active: true

                    }

                );

                toast.success("User Updated");

            }

            else {

                await api.post(

                    "/users",

                    user

                );

                toast.success("Employee Created");

            }

            reloadUsers();

            setSelectedUser(null);

        }

        catch (err) {

            console.log(err);

            toast.error("Operation Failed");

        }

    };



    return (

        <div className="product-card">

            <div className="card-header">

                <h3>

                    {

                        selectedUser

                        ?

                        "Update User"

                        :

                        "Create User"

                    }

                </h3>

            </div>

            <div className="card-body">

                <div className="input-group">

                    <label>

                        Username

                    </label>

                    <input

                        name="username"

                        autoComplete="off"

                        value={user.username}

                        onChange={handleChange}

                    />

                </div>

                <div className="input-group">

                    <label>

                        Email

                    </label>

                    <input

                        type="email"

                        name="email"

                        autoComplete="off"

                        value={user.email}

                        onChange={handleChange}

                    />

                </div>

                {

                    !selectedUser &&

                    <div className="input-group">

                        <label>

                            Password

                        </label>

                        <input

                            type="password"

                            name="password"

                            autoComplete="new-password"

                            value={user.password}

                            onChange={handleChange}

                        />

                    </div>

                }

                <div className="input-group">

                    <label>

                        Role

                    </label>

                    <select

                        name="role"

                        value={user.role}

                        onChange={handleChange}

                    >

                        <option value="EMPLOYEE">

                            EMPLOYEE

                        </option>

                        <option value="ADMIN">

                            ADMIN

                        </option>

                    </select>

                </div>

                <button

                    className="add-btn"

                    onClick={saveUser}

                >

                    {

                        selectedUser

                        ?

                        "Update User"

                        :

                        "Create User"

                    }

                </button>

            </div>

        </div>

    );

}

export default UserForm;