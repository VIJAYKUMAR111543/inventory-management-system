import { useEffect, useState } from "react";
import axios from "axios";

import "./styles/App.css";
import Navbar from "./components/Navbar";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import SummaryCard from "./components/SummaryCard";
import SearchBar from "./components/SearchBar";
import ProductForm from "./components/ProductForm";
import ProductTable from "./components/ProductTable";
import Advertisement from "./components/Advertisement";

function App() {

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const loadProducts = async () => {

    try {

      const response = await axios.get("/products");

      setProducts(response.data);
      setFilteredProducts(response.data);

    } catch (err) {

      console.log(err);

    }

  };

  useEffect(() => {

    loadProducts();

  }, []);

  return (

    <>

      <Navbar />

      <div className="app-container">

        <div className="dashboard-header">

          <div>

            <h2>Inventory Dashboard</h2>

            <p>Manage your products from one place.</p>

          </div>

          <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="colored"
    />

        </div>

        <div className="header">

          <SummaryCard
            total={filteredProducts.length}
          />

          <SearchBar
            products={products}
            setFilteredProducts={setFilteredProducts}
          />

        </div>

        <div className="main-content">

          <div className="left-side">

            <ProductForm
              reloadProducts={loadProducts}
              selectedProduct={selectedProduct}
              setSelectedProduct={setSelectedProduct}
            />

            <ProductTable
              products={filteredProducts}
              reloadProducts={loadProducts}
              setSelectedProduct={setSelectedProduct}
            />

          </div>

          <div className="right-side">

            <Advertisement />

          </div>

        </div>

      </div>

    </>

  );

}

export default App;