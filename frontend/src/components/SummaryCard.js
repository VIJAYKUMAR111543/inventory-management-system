import "./SummaryCard.css";

function SummaryCard({ total }) {

    return (

        <div className="summary-card">

            <div className="summary-title">

                Total Products

            </div>

            <div className="summary-value">

                {total}

            </div>

        </div>

    );

}

export default SummaryCard;