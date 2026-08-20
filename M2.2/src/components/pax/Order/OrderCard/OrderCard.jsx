import { Card, Button } from "antd";

function showprice(price) {
    return price?.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
}

function OrderCard({ carname, price, contact, status, discountPercent, onCheckout, onRemove }) {
    return (
        <Card
            style={{
                width: "75vw",
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
                        fontSize: 20,
                        color: "#222",
                        marginBottom: 2,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                    }}
                >
                    {carname?.toUpperCase()}
                </span>
                <span
                    style={{
                        fontWeight: 400,
                        fontSize: 15,
                        color: "#555",
                        marginBottom: 2,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                    }}
                >
                    Contact: {contact || "N/A"}
                </span>
                <span
                    style={{
                        fontWeight: 400,
                        fontSize: 15,
                        color: "#888",
                        marginBottom: 2,
                    }}
                >
                    Status: {status}
                </span>
            </div>
            <div style={{ textAlign: "center", minWidth: 180 }}>
                <span
                    style={{
                        fontWeight: 500,
                        fontSize: 18,
                        color: "#1976d2",
                        marginRight: 16,
                    }}
                >
                    {showprice(price)}
                    {discountPercent > 0 && (
                        <span style={{ color: "#00b018", marginLeft: 8 }}>
                            ({discountPercent}% off)
                        </span>
                    )}
                </span>
                <Button type="primary" danger onClick={onRemove} style={{ marginLeft: 16 }}>
                    Remove
                </Button>
                <Button type="primary" onClick={onCheckout} style={{ marginLeft: 16 }}>
                    Check Out
                </Button>
            </div>
        </Card>
    );
}
export default OrderCard;
