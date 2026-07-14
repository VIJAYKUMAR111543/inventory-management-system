import { useState, useEffect, useRef } from "react";
import api from "../services/api";
import { toast } from "react-toastify";
import "./ProductForm.css";

function ProductForm({
    reloadProducts,
    selectedProduct,
    setSelectedProduct,
}) {

    const [product, setProduct] = useState({
        id: "",
        name: "",
        description: "",
        price: "",
        quantity: "",
        category: "Electronics",
        image: null
    });

    const fileInputRef = useRef(null);

    useEffect(() => {

        if (selectedProduct) {

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

            setProduct({
                id: selectedProduct.id,
                name: selectedProduct.name,
                description: selectedProduct.description,
                price: selectedProduct.price,
                quantity: selectedProduct.quantity,
                category: selectedProduct.category,
                image: null
            });

        } else {

            setProduct({
                id: "",
                name: "",
                description: "",
                price: "",
                quantity: "",
                category: "Electronics",
                image: null
            });

        }
        if (fileInputRef.current) {
           fileInputRef.current.value = "";
}

    }, [selectedProduct]);

    const handleChange = (e) => {

    const { name, value, files } = e.target;

    if (name === "image") {

        const file = files[0];

        if (file) {

    const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/pjpeg"
    ];

    if (!allowedTypes.includes(file.type)) {

        toast.error("Only JPG, JPEG and PNG images are allowed.");

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }

        setProduct({
            ...product,
            image: null
        });

        return;
    }

    // Maximum size = 2 MB
    const maxSize = 2 * 1024 * 1024;

    if (file.size > maxSize) {

        toast.error("Image size must be less than 2 MB.");

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }

        setProduct({
            ...product,
            image: null
        });

        return;
    }

    setProduct({
        ...product,
        image: file
    });

}

    } else {

        setProduct({
            ...product,
            [name]: value
        });

    }

};
    const saveProduct = async () => {

        if (!product.id) {
            toast.warning("Please enter Product ID");
            return;
        }

        if (!product.name.trim()) {
            toast.warning("Please enter Product Name");
            return;
        }

        if (!product.description.trim()) {
            toast.warning("Please enter Product Description");
            return;
        }
        
        if (!product.price || Number(product.price) <= 0) {
            toast.warning("Please enter a valid Price");
            return;
        }

        if (product.quantity === "" || Number(product.quantity) < 0) {
            toast.warning("Please enter a valid Quantity");
            return;
        }

        const formData = new FormData();

        formData.append("id", product.id);
        formData.append("name", product.name);
        formData.append("description", product.description);
        formData.append("price", product.price);
        formData.append("quantity", product.quantity);
        formData.append("category", product.category);

        if (product.image) {
            formData.append("image", product.image);
        }

        try {

            if (selectedProduct) {

                await api.put(`/products?id=${product.id}`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                });

                toast.success("Product Updated Successfully");

            } else {

                await api.post("/products", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                });

                toast.success("Product Added Successfully");

            }

            reloadProducts();

            setSelectedProduct(null);

            setProduct({
                id: "",
                name: "",
                description: "",
                price: "",
                quantity: "",
                image: null
            });

            if (fileInputRef.current) {
                fileInputRef.current.value = "";
}

        } catch (err) {

            console.log(err);
            toast.error("Operation Failed");

        }

    };

    return (

        <div className="product-card">

            <div className="card-header">
                <h3>
                    {selectedProduct ? "Update Product" : "Add Product"}
                </h3>
            </div>

            <div className="card-body">

                <div className="input-group">

                    <label>Product ID</label>

                    <input
                        type="number"
                        name="id"
                        value={product.id}
                        onChange={handleChange}
                        disabled={selectedProduct}
                    />

                </div>

                <div className="input-group">

                    <label>Product Name</label>

                    <input
                        type="text"
                        name="name"
                        value={product.name}
                        onChange={handleChange}
                    />

                </div>

                <div className="input-group">

                    <label>Description</label>

                    <textarea
                        rows="3"
                        name="description"
                        value={product.description}
                        onChange={handleChange}
                    />

                </div>

                <div className="input-group">

    <label>Category</label>

    <select
        name="category"
        value={product.category}
        onChange={handleChange}
    >

        <option value="Electronics">Electronics</option>
        <option value="Furniture">Furniture</option>
        <option value="Grocery">Grocery</option>
        <option value="Sports">Sports</option>
        <option value="Stationery">Stationery</option>
        <option value="Clothing">Clothing</option>

    </select>

</div>

                <div className="row">

                    <div className="input-group">

                        <label>Price</label>

                        <input
                            type="number"
                            name="price"
                            value={product.price}
                            onChange={handleChange}
                        />

                    </div>

                    <div className="input-group">

                        <label>Quantity</label>

                        <input
                            type="number"
                            name="quantity"
                            value={product.quantity}
                            onChange={handleChange}
                        />

                    </div>

                </div>

                <div className="input-group">

                    <label>Product Image</label>

                    <input
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={handleChange}
                        ref={fileInputRef}
                    />

                </div>

                <button
                    className="add-btn"
                    onClick={saveProduct}
                >
                    {selectedProduct ? "Update Product" : "Add Product"}
                </button>

            </div>

        </div>

    );

}

export default ProductForm;