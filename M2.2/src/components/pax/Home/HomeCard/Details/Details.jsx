import { useState, useEffect } from "react";
import { fetchAllCars } from "../../../../FetchData";
import './Details.css';
import { useNavigate, useParams } from "react-router";
import { Col, Button, Input, Form } from "antd";
import { useAuth } from "../../../../AuthContext";
import { fetchDiscountsFromAPI } from "../../../../admin/Discount/Discount";

function formatPrice(price) {
    if (typeof price !== "number") return price;
    return price.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
}

function Details() {
    const { id } = useParams();
    const [cars, setCars] = useState([]);
    const [editData, setEditData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [discounts, setDiscounts] = useState({
        New: 0,
        "Daily Commute": 0,
        "Law Enforcement": 0,
        Display: 0,
        Motorsport: 0,
    });
    const navigate = useNavigate();
    const { admin } = useAuth();

    useEffect(() => {
        fetchAllCars().then(data => {
            setCars(data[id]);
            setEditData(data[id]);
        });
        fetchDiscountsFromAPI().then(setDiscounts);
    }, [id]);

    const discountPercent =
        discounts[cars.status] || discounts[cars.usage] || 0;
    const discountedPrice = cars.price ? cars.price - (cars.price * discountPercent) / 100 : cars.price;

    const handleCart = async () => {
        const userAccount = localStorage.getItem("account");
        const api = `https://mindx-mockup-server.vercel.app/api/resources/cardata/${cars._id}?apiKey=689f647d95f60a227657fefc`;
        await fetch(api, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...cars, incart: userAccount, confirmonsale: false })
        });
        alert("Added to cart!");
        navigate("/order");
    };

    const handleDelete = async () => {
        const api = `https://mindx-mockup-server.vercel.app/api/resources/cardata/${cars._id}?apiKey=689f647d95f60a227657fefc`;
        await fetch(api, { method: "DELETE" });
        alert("Car deleted!");
        navigate("/");
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmitEdit = async () => {
        setLoading(true);
        const api = `https://mindx-mockup-server.vercel.app/api/resources/cardata/${cars._id}?apiKey=689f647d95f60a227657fefc`;
        await fetch(api, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(editData)
        });
        alert("Car data updated!");
        setLoading(false);
        // Optionally, refresh data or navigate
    };

    if (localStorage.getItem("account") === "adminecg@gmail.com") {
        return (
            <div className="details-container">
                <div className="details-card details-white">
                    <Form layout="vertical" style={{ width: "100%" }}>
                        <Col span={18}>
                            <Form.Item label={<span style={{ color: "#fff" }}>Car Name</span>}>
                                <Input name="carname" value={editData?.carname || ""} onChange={handleInputChange} />
                            </Form.Item>
                            <Form.Item label={<span style={{ color: "#fff" }}>Price</span>}>
                                <Input name="price" value={editData?.price || ""} onChange={handleInputChange} />
                            </Form.Item>
                            <Form.Item label={<span style={{ color: "#fff" }}>Image URL</span>}>
                                <Input name="image" value={editData?.image || ""} onChange={handleInputChange} />
                            </Form.Item>
                            <Form.Item label={<span style={{ color: "#fff" }}>Description</span>}>
                                <Input name="description" value={editData?.description || ""} onChange={handleInputChange} />
                            </Form.Item>
                            <Form.Item label={<span style={{ color: "#fff" }}>Mileage</span>}>
                                <Input name="mileage" value={editData?.mileage || ""} onChange={handleInputChange} />
                            </Form.Item>
                            <Form.Item label={<span style={{ color: "#fff" }}>Usage</span>}>
                                <Input name="usage" value={editData?.usage || ""} onChange={handleInputChange} />
                            </Form.Item>
                            <Form.Item label={<span style={{ color: "#fff" }}>Color</span>}>
                                <Input name="color" value={editData?.color || ""} onChange={handleInputChange} />
                            </Form.Item>
                            <Form.Item label={<span style={{ color: "#fff" }}>Transmission</span>}>
                                <Input name="transmission" value={editData?.transmission || ""} onChange={handleInputChange} />
                            </Form.Item>
                            <Form.Item label={<span style={{ color: "#fff" }}>Engine</span>}>
                                <Input name="engine" value={editData?.engine || ""} onChange={handleInputChange} />
                            </Form.Item>
                            <Form.Item label={<span style={{ color: "#fff" }}>Contact</span>}>
                                <Input name="contact" value={editData?.contact || ""} onChange={handleInputChange} />
                            </Form.Item>
                        </Col>
                        <Col span={6} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                            <Button type="primary" style={{ width: "100%", marginBottom: 16 }} onClick={handleSubmitEdit} loading={loading}>
                                Submit Change
                            </Button>
                            <Button danger type="primary" style={{ width: "100%", marginBottom: 16 }} onClick={handleDelete}>
                                Delete
                            </Button>
                        </Col>
                    </Form>
                </div>
            </div>
        );
    }

    return (
        <div className="details-container">
            <div className="details-card details-white">
                <img src={cars.image} alt={cars.carname} className="details-image" />
                <div className="details-info details-white" style={{ display: "flex", gap: 32 }}>
                    <Col span={18}>
                        <h1 className="details-white">{cars.carname}</h1>
                        <h2 className="details-white">Status: {cars.status}</h2>
                        <p className="details-white">Usage: {cars.usage}</p>
                        <p className="details-white">Description: {cars.description}</p>
                        <p className="details-white">Mileage: {cars.mileage}</p>
                        <p className="details-white">Color: {cars.color}</p>
                        <p className="details-white">Transmission: {cars.transmission}</p>
                        <p className="details-white">Engine: {cars.engine}</p>
                    </Col>
                    <Col span={6} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                        <p className="details-white">
                            Price: {formatPrice(discountedPrice)}
                            {discountPercent > 0 && (
                                <span style={{ color: "#00b018", marginLeft: 8 }}>
                                    ({discountPercent}% off)
                                </span>
                            )}
                        </p>
                        <Button type="primary" style={{ width: "100%", marginBottom: 16 }} onClick={handleCart}>
                            Add to Cart
                        </Button>
                        <div style={{ marginTop: 16, textAlign: "center" }}>
                            <h3 className="details-white">Contact Info</h3>
                            <p className="details-white">{cars.contact || "N/A"}</p>
                        </div>
                    </Col>
                </div>
            </div>
        </div>
    )
}
export default Details;