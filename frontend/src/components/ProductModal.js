import "./ProductModal.css";

function ProductModal({

    product,
    onClose

}) {

    if (!product) {

        return null;

    }

    return (

        <div
            className="modal-overlay"
            onClick={onClose}
        >

            <div
                className="modal-card"
                onClick={(e) => e.stopPropagation()}
            >

                <button
                    className="close-btn"
                    onClick={onClose}
                >
                    ✕
                </button>

                <img
                    src={`http://127.0.0.1:8000/uploads/${product.image}`}
                    alt={product.name}
                    className="modal-image"
                />

                <h2>{product.name}</h2>

                <div className="modal-details">

                    <p>

                        <strong>ID :</strong> {product.id}

                    </p>

                    <p>

                        <strong>Category :</strong> {product.category}

                    </p>

                    <p>

                        <strong>Price :</strong> ₹ {product.price}

                    </p>

                    <p>

                        <strong>Quantity :</strong> {product.quantity}

                    </p>

                    <p>

                        <strong>Description :</strong>

                    </p>

                    <div className="description-box">

                        {product.description}

                    </div>

                </div>

            </div>

        </div>

    );

}

export default ProductModal;