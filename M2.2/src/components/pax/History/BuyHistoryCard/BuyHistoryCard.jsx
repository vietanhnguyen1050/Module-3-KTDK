import { Card } from "antd";
import "./BuyHistoryCard.css";

function showprice(price) {
    return price?.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
}

function BuyHistoryCard({ carname, price, delivered, done, contact, plate }) {
    let buystatus = "";
    let color = "#888";
    if (delivered === false && done === false) {
        buystatus = "Pending";
        color = "#ffc400";
    } else if (delivered === false && done === true) {
        buystatus = "Delivering";
        color = "#ff9800";
    } else if (delivered === true && done === true) {
        buystatus = "Delivered";
        color = "#388e3c";
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
                background: "#fff",
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
                <span
                    style={{
                        fontWeight: 500,
                        fontSize: 16,
                        color: "#1976d2",
                        marginBottom: 2,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                    }}
                >
                    Contact: {contact || "N/A"}
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
                    Price: {showprice(price * 101 / 100)}
                </span>
                <span
                    style={{
                        fontWeight: 700,
                        fontSize: 16,
                        color: color,
                    }}
                >
                    {buystatus}
                </span>
            </div>
        </Card>
    );
}
export default BuyHistoryCard;
