import { useEffect } from "react";

function SearchBar({
    searchText,
    setSearchText,
    setSelectedCategory
}) {

    useEffect(() => {

        if (searchText.trim() !== "") {

            setSelectedCategory("All");

        }

    }, [searchText, setSelectedCategory]);

    const handleSearchClick = () => {

        const table = document.getElementById("product-table");

        if (table) {

            table.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }

    };

    return (

        <div className="search-container">

            <div className="search-box">

                <input
                    type="text"
                    placeholder="Search by ID, Name or Description..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />

                <button
                    type="button"
                    className="search-btn"
                    onClick={handleSearchClick}
                >
                    Search
                </button>

            </div>

        </div>

    );

}

export default SearchBar;