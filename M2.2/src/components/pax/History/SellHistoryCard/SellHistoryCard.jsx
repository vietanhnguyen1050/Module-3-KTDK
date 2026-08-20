import { Card } from "antd";
import "./SellHistoryCard.css";

function showprice(price) {
    return price?.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
}

function SellHistoryCard({ carname, price, sold, plate, isPending }) {
    let sellstatus = "null"
    if (sold === false && isPending === false) {
        sellstatus = "Rejected"
    } else if (sold === false && isPending === true) {
        sellstatus = "Pending"
    } else if (sold === true && isPending === false) {
        sellstatus = "Approved"
    }
    return (
        <Card
            style={{
                width: "100%",
                minHeight: 64,
                display: "flex",
                alignItems: "center",
                borderRadius: 12,
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                margin: "12px 0",
                padding: 0,
                border: "none",
                background: "#ffffffff",
            }}
            bodyStyle={{
                width: "100%",
                padding: "16px 32px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
            }}
        >
            <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                <span
                    style={{
                        fontWeight: 700,
                        fontSize: 24,
                        color: "#222",
                        marginBottom: 2,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                    }}
                >
                    {carname}
                </span>
                <span
                    style={{
                        fontWeight: 600,
                        fontSize: 18,
                        color: "#555",
                        marginBottom: 2,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                    }}
                >
                    Plate: {plate || "N/A"}
                </span>
            </div>
            <div style={{ textAlign: "center", minWidth: 180 }}>
                <span
                    style={{
                        fontWeight: 600,
                        fontSize: 18,
                        color: "#1976d2",
                        marginRight: 30,
                    }}
                >
                    Requested: {showprice(price/1)}
                </span>
                <span
                    style={{
                        fontWeight: 700,
                        fontSize: 16,
                        color: sold ? "#388e3c" : isPending ? "#ffc400ff" : "#d32f2f",
                    }}
                >
                    {sellstatus}
                </span>
            </div>
        </Card>
    );
}
export default SellHistoryCard;