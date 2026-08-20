import { Card, Col, Input, Button } from "antd";
import { useState } from "react";
import { fetchAllUsers } from "../../../FetchData";

function Request({ name, description, image, status, response, email, phonenumber }) {
    const [responseText, setResponseText] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmitResponse = async () => {
        setLoading(true);
        try {
            const users = await fetchAllUsers();
            const user = users.find(u => u.email === email);
            if (!user) {
                alert("User not found!");
                setLoading(false);
                return;
            }
            const idx = (user.supporthistory || []).findIndex(
                item => item.name === name && item.description === description && item.image === image && item.status === false
            );
            if (idx === -1) {
                alert("Request not found!");
                setLoading(false);
                return;
            }
            const updatedSupporthistory = [...user.supporthistory];
            updatedSupporthistory[idx] = {
                ...updatedSupporthistory[idx],
                status: true,
                response: responseText
            };
            const api = `https://mindx-mockup-server.vercel.app/api/resources/users/${user._id}?apiKey=689f647d95f60a227657fefc`;
            await fetch(api, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...user, supporthistory: updatedSupporthistory })
            });
            alert("Response submitted!");
        } catch (e) {
            alert("Failed to submit response.");
        }
        setLoading(false);
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
                gap: 32,
            }}
        >
            <Col span={3}>
                <img
                    src={image}
                    alt={name}
                    style={{
                        width: 100,
                        height: 100,
                        objectFit: "cover",
                        borderRadius: 8,
                        background: "#eee",
                        marginBottom: 8
                    }}
                />
            </Col>
            <Col span={6}>
                <span style={{ fontWeight: 700, fontSize: 20, color: "#222" }}>
                    {name}
                </span>
                <br />
                <span style={{ fontWeight: 500, fontSize: 16, color: "#555" }}>
                    {description}
                </span>
            </Col>
            <Col span={4}>
                <span style={{ fontWeight: 500, fontSize: 16, color: "#1976d2" }}>
                    {email}
                </span>
                <br />
                <span style={{ fontWeight: 500, fontSize: 16, color: "#1976d2" }}>
                    {phonenumber}
                </span>
            </Col>
            <Col span={8}>
                <span
                    style={{
                        fontWeight: 600,
                        fontSize: 16,
                        color: status ? "#388e3c" : "#ffc400",
                        marginRight: 24,
                    }}
                >
                    {status ? "Responded" : "Pending"}
                </span>
                {status && (
                    <div style={{ marginTop: 8 }}>
                        <strong>Response:</strong>
                        <p style={{ margin: 0 }}>{response}</p>
                    </div>
                )}
                {!status && (
                    <div style={{ marginTop: 8 }}>
                        <Input.TextArea
                            rows={2}
                            placeholder="Type your response..."
                            value={responseText}
                            onChange={e => setResponseText(e.target.value)}
                            style={{ marginBottom: 8, width: 180 }}
                        />
                        <br />
                        <Button
                            type="primary"
                            onClick={handleSubmitResponse}
                            loading={loading}
                            style={{ width: 120 }}
                        >
                            Submit Response
                        </Button>
                    </div>
                )}
            </Col>
        </Card>
    );
}

export default Request;
