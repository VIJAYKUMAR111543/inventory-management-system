import { useState } from "react";

function SearchBar({ products, setFilteredProducts }) {

  const [search, setSearch] = useState("");

  const handleSearch = () => {

    if (search.trim() === "") {
      setFilteredProducts(products);
      return;
    }

    const filtered = products.filter((product) => {

      return (
        product.id.toString().includes(search) ||
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.description.toLowerCase().includes(search.toLowerCase())
      );

    });

    setFilteredProducts(filtered);

  };

  return (

    <div className="search-box">

      <input
        type="text"
        placeholder="Search by ID, Name or Description"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <button
        className="search-btn"
        onClick={handleSearch}
      >
        Search
      </button>

    </div>

  );

}

export default SearchBar;