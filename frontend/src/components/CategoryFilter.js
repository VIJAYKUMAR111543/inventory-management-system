import "./CategoryFilter.css";

function CategoryFilter({ selectedCategory, setSelectedCategory }) {

    return (

        <select
            className="category-filter"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
        >
            <option value="All">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Furniture">Furniture</option>
            <option value="Grocery">Grocery</option>
            <option value="Sports">Sports</option>
            <option value="Stationery">Stationery</option>
            <option value="Clothing">Clothing</option>
        </select>

    );

}

export default CategoryFilter;