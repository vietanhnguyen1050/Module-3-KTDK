import { Card } from "antd";

function Request({ name, description, image, status, response }) {
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
            <div style={{ flex: "0 0 120px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <img
                    src={image}
                    alt={name}
                    style={{
                        width: 100,
                        height: 100,
                        objectFit: "cover",
                        borderRadius: 8,
                        background: "#eee"
                    }}
                />
            </div>
            <div style={{ flex: 1 }}>
                <h2 style={{ margin: 0, fontWeight: 700 }}>{name}</h2>
                <p style={{ margin: "8px 0", color: "#555" }}>{description}</p>
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
            </div>
        </Card>
    );
}

export default Request;
