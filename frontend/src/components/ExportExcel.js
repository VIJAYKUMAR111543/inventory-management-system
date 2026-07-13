import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import "./ExportExcel.css";

function ExportExcel({ products }) {

    const exportToExcel = () => {

        const data = products.map((product) => ({

            "Product ID": product.id,
            "Product Name": product.name,
            "Category": product.category,
            "Description": product.description,
            "Price (₹)": product.price,
            "Quantity": product.quantity,

            "Stock Status":
                product.quantity === 0
                    ? "Out of Stock"
                    : product.quantity <= 5
                    ? "Low Stock"
                    : "In Stock"

        }));

        const worksheet = XLSX.utils.json_to_sheet(data);

        const workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(
            workbook,
            worksheet,
            "Inventory"
        );

        const excelBuffer = XLSX.write(
            workbook,
            {
                bookType: "xlsx",
                type: "array"
            }
        );

        const file = new Blob(
            [excelBuffer],
            {
                type:
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8"
            }
        );

        saveAs(file, "inventory.xlsx");

    };

    return (

        <button
            className="export-btn"
            onClick={exportToExcel}
        >

            📥 Export Excel

        </button>

    );

}

export default ExportExcel;