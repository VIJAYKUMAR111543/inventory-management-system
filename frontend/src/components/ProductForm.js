import { useState, useEffect } from "react";
import axios from "axios";

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
    quantity: ""
  });

  useEffect(() => {

    if (selectedProduct) {

      setProduct({
        id: selectedProduct.id,
        name: selectedProduct.name,
        description: selectedProduct.description,
        price: selectedProduct.price,
        quantity: selectedProduct.quantity
      });

    }

  }, [selectedProduct]);

  const handleChange = (e) => {

    setProduct({
      ...product,
      [e.target.name]: e.target.value
    });

  };

  const saveProduct = async () => {

    try {

      if (selectedProduct) {

        await axios.put(`/products?id=${product.id}`, {
          id: Number(product.id),
          name: product.name,
          description: product.description,
          price: Number(product.price),
          quantity: Number(product.quantity)
        });

        alert("Product Updated Successfully");

      } else {

        await axios.post("/products", {
          id: Number(product.id),
          name: product.name,
          description: product.description,
          price: Number(product.price),
          quantity: Number(product.quantity)
        });

        alert("Product Added Successfully");

      }

      reloadProducts();

      setSelectedProduct(null);

      setProduct({
        id: "",
        name: "",
        description: "",
        price: "",
        quantity: ""
      });

    }

    catch (err) {

      console.log(err);

      alert("Operation Failed");

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

          <label>ID</label>

          <input
            type="number"
            name="id"
            value={product.id}
            onChange={handleChange}
            disabled={selectedProduct}
          />

        </div>

        <div className="input-group">

          <label>Name</label>

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