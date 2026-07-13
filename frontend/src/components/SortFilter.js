import "./SortFilter.css";

function SortFilter({
    sortOption,
    setSortOption
}) {

    return (

        <select
            className="sort-filter"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
        >

            <option value="default">Sort By</option>

            <option value="id-asc">
                ID (Low → High)
            </option>

            <option value="id-desc">
                ID (High → Low)
            </option>

            <option value="name-asc">
                Name (A → Z)
            </option>

            <option value="name-desc">
                Name (Z → A)
            </option>

            <option value="price-asc">
                Price (Low → High)
            </option>

            <option value="price-desc">
                Price (High → Low)
            </option>

            <option value="quantity-asc">
                Quantity (Low → High)
            </option>

            <option value="quantity-desc">
                Quantity (High → Low)
            </option>

        </select>

    );

}

export default SortFilter;