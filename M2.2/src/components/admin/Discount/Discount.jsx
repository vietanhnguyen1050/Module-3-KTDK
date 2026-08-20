import { useEffect, useState } from "react";
import { InputNumber, Slider, Button } from "antd";
import { adminFetchSpecificUser, fetchSpecificUser } from "../../FetchData";

export async function fetchDiscountsFromAPI() {
    const admin = await adminFetchSpecificUser("adminecg@gmail.com");
    return admin && admin.discounts ? admin.discounts : {
        New: 0,
        "Daily Commute": 0,
        "Law Enforcement": 0,
        Display: 0,
        Motorsport: 0,
    };
}

function Discount() {
    const [discounts, setDiscounts] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchDiscountsFromAPI().then(setDiscounts);
    }, []);

    const handleChange = (key, value) => {
        setDiscounts(prev => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        const admin = await fetchSpecificUser("adminecg@gmail.com");
        if (!admin) {
            alert("Admin account not found!");
            setLoading(false);
            return;
        }
        const api = `https://mindx-mockup-server.vercel.app/api/resources/users/${admin._id}?apiKey=689f647d95f60a227657fefc`;
        await fetch(api, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...admin, discounts }),
        });
        alert("Discounts updated!");
        setLoading(false);
    };

    const sliderStyle = {
        width: 300,
        display: "inline-block",
        verticalAlign: "middle",
        marginLeft: 16,
    };
    const labelStyle = {
        color: "#fff",
        fontWeight: 600,
        width: 140,
        display: "inline-block",
        textAlign: "right",
        marginRight: 16,
    };
    const rowStyle = {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 24,
        width: "100%",
    };

    // Show loading or nothing until discounts are loaded
    if (!discounts) {
        return <div style={{ color: "#fff", textAlign: "center" }}>Loading discounts...</div>;
    }

    return (
        <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <h1 style={{ color: "#fff", textAlign: "center" }}>Set Discounts</h1>
            <div style={{ width: "100%", maxWidth: 600 }}>
                <div style={rowStyle}>
                    <span style={labelStyle}>New</span>
                    <InputNumber
                        min={0}
                        max={99}
                        value={discounts.New}
                        onChange={value => handleChange("New", value)}
                        style={{ marginRight: 16 }}
                    />
                    <Slider
                        min={0}
                        max={99}
                        value={discounts.New}
                        onChange={value => handleChange("New", value)}
                        style={sliderStyle}
                    />
                </div>
                <div style={rowStyle}>
                    <span style={labelStyle}>Daily Commute</span>
                    <InputNumber
                        min={0}
                        max={99}
                        value={discounts["Daily Commute"]}
                        onChange={value => handleChange("Daily Commute", value)}
                        style={{ marginRight: 16 }}
                    />
                    <Slider
                        min={0}
                        max={99}
                        value={discounts["Daily Commute"]}
                        onChange={value => handleChange("Daily Commute", value)}
                        style={sliderStyle}
                    />
                </div>
                <div style={rowStyle}>
                    <span style={labelStyle}>Law Enforcement</span>
                    <InputNumber
                        min={0}
                        max={99}
                        value={discounts["Law Enforcement"]}
                        onChange={value => handleChange("Law Enforcement", value)}
                        style={{ marginRight: 16 }}
                    />
                    <Slider
                        min={0}
                        max={99}
                        value={discounts["Law Enforcement"]}
                        onChange={value => handleChange("Law Enforcement", value)}
                        style={sliderStyle}
                    />
                </div>
                <div style={rowStyle}>
                    <span style={labelStyle}>Display</span>
                    <InputNumber
                        min={0}
                        max={99}
                        value={discounts.Display}
                        onChange={value => handleChange("Display", value)}
                        style={{ marginRight: 16 }}
                    />
                    <Slider
                        min={0}
                        max={99}
                        value={discounts.Display}
                        onChange={value => handleChange("Display", value)}
                        style={sliderStyle}
                    />
                </div>
                <div style={rowStyle}>
                    <span style={labelStyle}>Motorsport</span>
                    <InputNumber
                        min={0}
                        max={99}
                        value={discounts.Motorsport}
                        onChange={value => handleChange("Motorsport", value)}
                        style={{ marginRight: 16 }}
                    />
                    <Slider
                        min={0}
                        max={99}
                        value={discounts.Motorsport}
                        onChange={value => handleChange("Motorsport", value)}
                        style={sliderStyle}
                    />
                </div>
                <div style={{ textAlign: "center", marginTop: 32 }}>
                    <Button type="primary" loading={loading} onClick={handleSubmit}>
                        Submit
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default Discount;