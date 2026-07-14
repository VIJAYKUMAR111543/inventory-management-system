import api from "../services/api";
import { toast } from "react-toastify";
import "./ProductTable.css";

function ProductTable({
    user,
    products,
    reloadProducts,
    setSelectedProduct,
    setViewProduct,
    exportButton,
}) {

    const deleteProduct = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this product?"
        );

        if (!confirmDelete) {
            return;
        }

        try {

            await api.delete(`/products?id=${id}`);

            reloadProducts();

            toast.success("Product Deleted Successfully");

        } catch (err) {

            console.log(err);

            toast.error("Unable to delete product");

        }

    };

    const getStockStatus = (quantity) => {

        if (quantity === 0) {
            return "Out of Stock";
        }

        if (quantity <= 5) {
            return "Low Stock";
        }

        return "In Stock";

    };

    const getStatusClass = (quantity) => {

        if (quantity === 0) {
            return "stock-badge out-stock";
        }

        if (quantity <= 5) {
            return "stock-badge low-stock";
        }

        return "stock-badge in-stock";

    };

    return (

        <div
    className="table-card"
    id="product-table"
>

            <div className="table-header">

                <h3>Products</h3>

                {exportButton}

            </div>

            <table className="product-table">

                <thead>

                    <tr>
                        <th>Image</th>
                        <th>ID</th>
                        <th>Product</th>
                        <th>Category</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Status</th>
                        <th>Actions</th>

                    </tr>

                </thead>

                <tbody>

                    {products.length > 0 ? (

                        products.map((product) => (

                            <tr key={product.id}>

    <td>

        {product.image ? (

            <img
                src={`http://127.0.0.1:8000/uploads/${product.image}`}
                alt={product.name}
                className="product-image"
                onClick={() => setViewProduct(product)}
                style={{ cursor: "pointer" }}
            />

        ) : (

            <div className="no-image">
                No Image
            </div>

        )}

    </td>

    <td>{product.id}</td>

                                <td>{product.name}</td>

                                <td>{product.category}</td>

                                <td>{product.description}</td>

                                <td>
                                    ₹ {Number(product.price).toFixed(2)}
                                </td>

                                <td>{product.quantity}</td>

                                <td>

                                    <span className={getStatusClass(product.quantity)}>

                                        {getStockStatus(product.quantity)}

                                    </span>

                                </td>

                                <td>

    {user?.role === "ADMIN" ? (

        <div className="action-buttons">

            <button
                className="edit-btn"
                onClick={() => setSelectedProduct(product)}
            >
                Edit
            </button>

            <button
                className="delete-btn"
                onClick={() => deleteProduct(product.id)}
            >
                Delete
            </button>

        </div>

    ) : (

        <span
            style={{
                color: "#16a34a",
                fontWeight: "600"
            }}
        >
            View Only
        </span>

    )}

</td>

                            </tr>

                        ))

                    ) : (

                        <tr>

                            <td
                                className="empty-table"
                                colSpan="9"
                            >

                                <div className="empty-state">

                                    <div className="empty-icon">📦</div>

                                    <h3>No Products Found</h3>

                                    <p>Start by adding your first product.</p>

                                </div>

                            </td>

                        </tr>

                    )}

                </tbody>

            </table>

        </div>

    );

}

export default ProductTable;