import { Card, Col, Button, InputNumber } from "antd";
import { useState } from "react";
import "./RequestCard.css";
import { adminFetchSpecificUser, fetchSpecificUser } from "../../../FetchData";

function showprice(price) {
    return price?.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
}

function RequestCard({ email, carname, price, sold, plate, isPending, contact }) {
    const [disabled, setDisabled] = useState(false);
    const [pricePercentage, setPricePercentage] = useState(price/9*10);
    const handlePercentage = (value) => {
        setPricePercentage(price / (100 - value) * 100);
    }
    const handleUpdate = async (updateObj) => {
        const user = await adminFetchSpecificUser(email);
        if (!user) return;
        const idx = (user.sellhistory || []).findIndex(
            item => item.carname === carname && item.plate === plate
        );
        if (idx === -1) return;
        const updatedSellhistory = [...user.sellhistory];
        updatedSellhistory[idx] = { ...updatedSellhistory[idx], ...updateObj };
        // PUT to API
        const api = `https://mindx-mockup-server.vercel.app/api/resources/users/${user._id}?apiKey=689f647d95f60a227657fefc`;
        await fetch(api, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...user, sellhistory: updatedSellhistory })
        });
        setDisabled(true);
    };

    const handleApprove = async () => {
        const admin = await adminFetchSpecificUser("adminecg@gmail.com");
        const addSummary = {
            income: false,
            name: `Bought ${carname}, ${plate} from ${email}`,
            amount: -price,};
        const adminapi = `https://mindx-mockup-server.vercel.app/api/resources/users/${admin._id}?apiKey=689f647d95f60a227657fefc`;
        const updatedSummary = admin.summary ? [...admin.summary, addSummary] : [addSummary];
        await fetch(adminapi, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...admin, summary: updatedSummary })
        });

        await handleUpdate({ sold: true, isPending: false, price: price, confirmonsale: true });
        const user = await adminFetchSpecificUser(email);
        if (!user) return;
        const idx = (user.sellhistory || []).findIndex(
            item => item.carname === carname && item.plate === plate
        );
        if (idx === -1) return;
        const dataupload = { ...user.sellhistory[idx], sold: true, isPending: false, price: pricePercentage, confirmonsale: true };
        const carApi = `https://mindx-mockup-server.vercel.app/api/resources/cardata?apiKey=689f647d95f60a227657fefc`;
        await fetch(carApi, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dataupload)
        });
        alert("Request has been processed.");
    };
    const handleReject = () => {
        handleUpdate({ sold: false, isPending: false });
        alert("Request has been processed.");
    };

    return (
        <Card
            style={{
                width: "75%",
                minHeight: 64,
                display: "flex",
                alignItems: "space-around",
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
            <Col span={6}>
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
            </Col>
            <Col span={6} style={{ textAlign: "center", minWidth: 180 }}>
                                <span
                    style={{
                        fontWeight: 600,
                        fontSize: 18,
                        color: "#222",
                        marginBottom: 2,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                    }}
                >
                    {email}
                </span>
                <br />
                <span
                    style={{
                        fontWeight: 500,
                        fontSize: 16,
                        color: "#555",
                        marginBottom: 2,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                    }}
                >
                    Contact: {contact || "N/A"}
                </span>
            </Col>
            <Col span={9} style={{ textAlign: "right", minWidth: 180 }}>
                <span
                    style={{
                        fontWeight: 600,
                        fontSize: 18,
                        color: "#1976d2",
                        marginRight: 30,
                    }}
                >
                    Request: {showprice(price / 1)}
                </span>
                <br />
                <span
                    style={{
                        fontWeight: 600,
                        fontSize: 18,
                        color: "#00b018ff",
                        marginRight: 30,
                    }}
                >
                    Sell for: {showprice(pricePercentage)}
                </span>
                <br />
                <InputNumber min={1} max={99} defaultValue={10} onChange={handlePercentage} changeOnWheel/>
            </Col>
            <Col span={3} style={{ textAlign: "right", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                <Button type="primary" onClick={handleReject} danger style={{ width: 80, marginBottom: 8 }} disabled={disabled}>
                    Reject
                </Button>
                <Button type="primary" onClick={handleApprove} style={{ width: 80, background: "#52c41a", borderColor: "#52c41a" }} disabled={disabled}>
                    Approve
                </Button>
            </Col>
        </Card>
    );
}
export default RequestCard;