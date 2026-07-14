import { toast } from "react-toastify";
import api from "../services/api";
import { getCurrentUser } from "../services/authService";

function UserTable({

    users,

    reloadUsers,

    setSelectedUser

}) {

    const deleteUser = async (id) => {

    const loggedInUser = getCurrentUser();

    if (loggedInUser?.id === id) {

        toast.warning("You cannot delete your own account.");

        return;

    }

    const confirmDelete = window.confirm(
    "Delete this user?"
);

if (!confirmDelete) return;

try {

    await api.delete(`/users/${id}`);

    toast.success("User Deleted Successfully");

    reloadUsers();

} catch (err) {

    toast.error(
        err.response?.data?.detail ||
        "Unable to delete user."
    );

}
};

    const changeStatus = async (

        id,

        currentStatus

    ) => {

        try {

            await api.patch(

                `/users/${id}/status?is_active=${!currentStatus}`

            );

            toast.success(
                "Status Updated"
            );

            reloadUsers();

        }

        catch (err) {

            console.log(err);

            toast.error(
                "Unable to update status."
            );

        }

    };

    return (

        <div className="table-card">

            <div className="table-header">

                <h3>

                    System Users

                </h3>

            </div>

            <table className="product-table">

                <thead>

                    <tr>

                        <th>ID</th>

                        <th>Username</th>

                        <th>Email</th>

                        <th>Role</th>

                        <th>Status</th>

                        <th>Actions</th>

                    </tr>

                </thead>

                <tbody>

                    {

                        users.length > 0 ?

                        users.map((user) => (

                            <tr key={user.id}>

                                <td>

                                    {user.id}

                                </td>

                                <td>

                                    {user.username}

                                </td>

                                <td>

                                    {user.email}

                                </td>

                                <td>

                                    {user.role}

                                </td>

                                <td>

                                    {

                                        user.is_active ?

                                        <span
                                            className="stock-badge in-stock"
                                        >
                                            Active
                                        </span>

                                        :

                                        <span
                                            className="stock-badge out-stock"
                                        >
                                            Inactive
                                        </span>

                                    }

                                </td>

                                <td>

                                    <div
                                        className="action-buttons"
                                    >

                                        <button
                                            className="edit-btn"
                                            onClick={() =>
                                                setSelectedUser(user)
                                            }
                                        >
                                            Edit
                                        </button>

                                        <button
                                            className="delete-btn"
                                            onClick={() =>
                                                deleteUser(user.id)
                                            }
                                        >
                                            Delete
                                        </button>

                                        <button
                                            className="edit-btn"
                                            onClick={() =>
                                                changeStatus(
                                                    user.id,
                                                    user.is_active
                                                )
                                            }
                                        >

                                            {

                                                user.is_active ?

                                                "Deactivate"

                                                :

                                                "Activate"

                                            }

                                        </button>

                                    </div>

                                </td>

                            </tr>

                        ))

                        :

                        <tr>

                            <td
                                colSpan="6"
                                className="empty-table"
                            >

                                No Users Found

                            </td>

                        </tr>

                    }

                </tbody>

            </table>

        </div>

    );

}

export default UserTable;