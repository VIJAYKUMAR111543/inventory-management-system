
import { useEffect, useState } from "react";

import { getCurrentUser } from "../services/authService";
import "../styles/App.css";

import Navbar from "../components/Navbar";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import SummaryCard from "../components/SummaryCard";
import SearchBar from "../components/SearchBar";
import ProductForm from "../components/ProductForm";
import ProductTable from "../components/ProductTable";
import Advertisement from "../components/Advertisement";
import CategoryFilter from "../components/CategoryFilter";
import SortFilter from "../components/SortFilter";
import ProductModal from "../components/ProductModal";
import ExportExcel from "../components/ExportExcel";
import api from "../services/api";
function Dashboard() {

    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [viewProduct, setViewProduct] = useState(null);
    const [user, setUser] = useState(null);

    const [selectedCategory, setSelectedCategory] = useState("All");
    const [searchText, setSearchText] = useState("");
    const [sortOption, setSortOption] = useState("default");
    


    const loadProducts = async () => {

        try {

            const response = await api.get("/products");

            setProducts(response.data);

        } catch (err) {

            console.log(err);

        }

    };

    const loadCurrentUser = async () => {

    try {

        const currentUser = await getCurrentUser();

        setUser(currentUser);

    } catch (err) {

        console.log(err);

    }

};

    useEffect(() => {
         
        loadCurrentUser();

        loadProducts();

    }, []);

    useEffect(() => {

        let filtered = [...products];

        // Category Filter
        if (selectedCategory !== "All") {

            filtered = filtered.filter(

                (product) =>

                    product.category === selectedCategory

            );

        }

        // Search Filter
        if (searchText.trim() !== "") {

            filtered = filtered.filter(

                (product) =>

                    product.id.toString().includes(searchText) ||

                    product.name.toLowerCase().includes(searchText.toLowerCase()) ||

                    product.description.toLowerCase().includes(searchText.toLowerCase())

            );

        }
// Sorting

switch (sortOption) {

    case "id-asc":
        filtered.sort((a, b) => a.id - b.id);
        break;

    case "id-desc":
        filtered.sort((a, b) => b.id - a.id);
        break;

    case "name-asc":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;

    case "name-desc":
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;

    case "price-asc":
        filtered.sort((a, b) => a.price - b.price);
        break;

    case "price-desc":
        filtered.sort((a, b) => b.price - a.price);
        break;

    case "quantity-asc":
        filtered.sort((a, b) => a.quantity - b.quantity);
        break;

    case "quantity-desc":
        filtered.sort((a, b) => b.quantity - a.quantity);
        break;

    default:
        break;

}
        setFilteredProducts(filtered);

    }, [products, selectedCategory, searchText, sortOption]);
        return (

        <>

            <Navbar user={user} />

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

                    <div className="header-right">

                        <CategoryFilter
                            selectedCategory={selectedCategory}
                            setSelectedCategory={setSelectedCategory}
                        />
                        <SortFilter
                          sortOption={sortOption}
                          setSortOption={setSortOption}
                        />
                        <SearchBar
                            searchText={searchText}
                            setSearchText={setSearchText}
                            setSelectedCategory={setSelectedCategory}
                        />

                    </div>

                </div>

                <div className="main-content">

                    <div className="left-side">

                        {user?.role === "ADMIN" && (

    <ProductForm
        user={user}
        reloadProducts={loadProducts}
        selectedProduct={selectedProduct}
        setSelectedProduct={setSelectedProduct}
    />

)}


<ProductTable
user={user}
    products={filteredProducts}
    reloadProducts={loadProducts}
    setSelectedProduct={setSelectedProduct}
    setViewProduct={setViewProduct}
    exportButton={
        <ExportExcel
            products={filteredProducts}
        />
    }
/>
<ProductModal
    product={viewProduct}
    onClose={() => setViewProduct(null)}
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

export default Dashboard;