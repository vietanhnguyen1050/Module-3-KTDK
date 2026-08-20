import { Card, Col, Button } from "antd";
import { useState, useEffect } from "react";
import { fetchAllUsers, fetchSpecificUser } from "../../../FetchData";

function showprice(price) {
    return price?.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
}

function BuyCard({ email, carname, price, plate, phonenumber, delivered, done }) {
    const [deliveringDisabled, setDeliveringDisabled] = useState(done);
    const [deliveredDisabled, setDeliveredDisabled] = useState(!done || delivered);
    const handleUpdate = async (updateObj) => {
        // Fetch the user by email
        const users = await fetchAllUsers();
        const user = users.find(u => u.email === email);
        if (!user) return;
        // Find the buyhistory item index
        const idx = (user.buyhistory || []).findIndex(
            item => item.carname === carname && item.plate === plate
        );
        if (idx === -1) return;
        // Update the buyhistory item
        const updatedBuyhistory = [...user.buyhistory];
        updatedBuyhistory[idx] = { ...updatedBuyhistory[idx], ...updateObj };
        // PUT to API
        const api = `https://mindx-mockup-server.vercel.app/api/resources/users/${user._id}?apiKey=689f647d95f60a227657fefc`;
        await fetch(api, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...user, buyhistory: updatedBuyhistory })
        });
    };

    const handleDelivering = async () => {
        await handleUpdate({ done: true });
        setDeliveringDisabled(true);
        setDeliveredDisabled(false);
        alert("Status updated to Delivering!");
    };

    const handleDelivered = async () => {
        await handleUpdate({ delivered: true });
        setDeliveredDisabled(true);
        const admin = await fetchSpecificUser();
        const addSummary = {
            income: true,
            name: `Sold ${carname}, ${plate} to ${email}`,
            amount: price,
        };
        const adminapi = `https://mindx-mockup-server.vercel.app/api/resources/users/${admin._id}?apiKey=689f647d95f60a227657fefc`;
                const updatedSummary = admin.summary ? [...admin.summary, addSummary] : [addSummary];
                await fetch(adminapi, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ ...admin, summary: updatedSummary })
                });
        alert("Status updated to Delivered!");
    };

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
            <Col span={8}>
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
                <br />
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
                <br />
                <span
                    style={{
                        fontWeight: 500,
                        fontSize: 16,
                        color: "#222",
                        marginRight: 30,
                    }}
                >
                    Buyer: {email}
                </span>
            </Col>
            <Col span={9} style={{ textAlign: "right", minWidth: 180 }}>
                <span
                    style={{
                        fontWeight: 600,
                        fontSize: 18,
                        color: "#00d507ff",
                        marginRight: 30,
                    }}
                >
                    Price: {showprice(price)}
                </span>
                <br />
                                <span
                    style={{
                        fontWeight: 600,
                        fontSize: 18,
                        color: "#1976d2",
                        marginRight: 30,
                    }}
                >
                    Deliver Fee: {showprice(price * 1 / 100)}
                </span>
                <br />
                <span
                    style={{
                        fontWeight: 500,
                        fontSize: 16,
                        color: "#222",
                        marginRight: 30,
                    }}
                >
                    Phone: {phonenumber || "N/A"}
                </span>
                <br />

            </Col>
            <Col span={4} style={{ textAlign: "right", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                <Button
                    type="primary"
                    style={{ width: 120, marginBottom: 8, background: "#1890ff", borderColor: "#1890ff" }}
                    disabled={deliveringDisabled}
                    onClick={handleDelivering}
                >
                    Delivering
                </Button>
                <Button
                    type="primary"
                    style={{ width: 120, background: "#52c41a", borderColor: "#52c41a" }}
                    disabled={deliveredDisabled}
                    onClick={handleDelivered}
                >
                    Delivered
                </Button>
            </Col>
        </Card>
    );
}
export default BuyCard;
