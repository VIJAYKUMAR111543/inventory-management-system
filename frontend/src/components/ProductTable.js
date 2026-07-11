import axios from "axios";

function ProductTable({
  products,
  reloadProducts,
  setSelectedProduct,
}) {

  const deleteProduct = async (id) => {

    try {

      await axios.delete(`/products?id=${id}`);

      reloadProducts();

    } catch (err) {

      console.log(err);

      alert("Unable to delete product");

    }

  };

  return (

    <div className="table-card">

      <div className="card-header">
        <h3>Products</h3>
      </div>

      <table className="product-table">

        <thead>

          <tr>
            <th>ID</th>
            <th>NAME</th>
            <th>DESCRIPTION</th>
            <th>PRICE</th>
            <th>QUANTITY</th>
            <th>ACTIONS</th>
          </tr>

        </thead>

        <tbody>

          {products.length > 0 ? (

            products.map((product) => (

              <tr key={product.id}>

                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>{product.description}</td>
                <td>{product.price}</td>
                <td>{product.quantity}</td>

                <td>

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

                </td>

              </tr>

            ))

          ) : (

            <tr>

              <td colSpan="6" style={{ textAlign: "center" }}>
                No Products Found
              </td>

            </tr>

          )}

        </tbody>

      </table>

    </div>

  );

}

export default ProductTable;