import { Card, Col } from "antd";
import "./SummaryCard.css";

function showprice(price) {
    return price?.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
}

function SummaryCard({ income, name, amount }) {
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
            <Col span={18} style={{ textAlign: "left", minWidth: 180 }}>
                <h2>{name}</h2>
            </Col>
            <Col span={6} style={{ textAlign: "right", minWidth: 180 }}>
                <h2 style={{
                    color: income ? "green" : "red"
                }}>{showprice(amount)}</h2>
            </Col>
        </Card>
    );
}
export default SummaryCard;