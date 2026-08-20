import { useParams, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { Button } from "antd";
import { fetchAllCars, adminFetchSpecificUser } from "../../../FetchData";
import { fetchDiscountsFromAPI } from "../../../admin/Discount/Discount";

function showprice(price) {
    return price?.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
}

function Checkout() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [car, setCar] = useState({});
    const [discounts, setDiscounts] = useState({
        New: 0,
        "Daily Commute": 0,
        "Law Enforcement": 0,
        Display: 0,
        Motorsport: 0,
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchAllCars().then(data => {
            const found = data.find(car => car._id === id);
            setCar(found || {});
        });
        fetchDiscountsFromAPI().then(setDiscounts);
    }, [id]);

    const discountPercent =
        discounts[car.status] || discounts[car.usage] || 0;
    const discountedPrice = car.price ? car.price - (car.price * discountPercent) / 100 : car.price;
    const deliveryCost = discountedPrice ? discountedPrice * 0.01 : 0;

    const handleConfirm = async () => {
        setLoading(true);
        try {
            // Step 1: Get user data and append car to buyhistory
            const userEmail = localStorage.getItem("account");
            const user = await adminFetchSpecificUser(userEmail);
            if (user) {
                const buyhistory = Array.isArray(user.buyhistory) ? [...user.buyhistory] : [];
                buyhistory.push({ ...car, delivered: false, done: false, price: discountedPrice });
                const userApi = `https://mindx-mockup-server.vercel.app/api/resources/users/${user._id}?apiKey=689f647d95f60a227657fefc`;
                await fetch(userApi, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ ...user, buyhistory, bought: true})
                });
            }
            // Step 2: Delete car from cardata
            const carApi = `https://mindx-mockup-server.vercel.app/api/resources/cardata/${id}?apiKey=689f647d95f60a227657fefc`;
            await fetch(carApi, { method: "DELETE" });

            alert("Checkout confirmed!");
        } catch (error) {
            alert("Checkout failed!");
        }
        navigate("/history");
        setLoading(false);
    };

    return (
        <div style={{
            width: "75vw",
            minHeight: "100vh",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center"
        }}>
            <h1 style={{color:"white"}}>Checkout</h1>
            <div style={{ width: "100%", maxWidth: 600, background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", padding: 32 }}>
                <p><strong>Car Name:</strong> {car.carname}</p>
                <p>
                    <strong>Price:</strong> {showprice(discountedPrice)}
                    {discountPercent > 0 && (
                        <span style={{ color: "#00b018", marginLeft: 8 }}>
                            ({discountPercent}% off)
                        </span>
                    )}
                </p>
                <p><strong>Delivery Cost (1%):</strong> {showprice(deliveryCost)}</p>
                <p><strong>Contact:</strong> {car.contact || "N/A"}</p>
                <Button type="primary" onClick={handleConfirm} loading={loading} style={{ width: "100%", marginTop: 24 }}>
                    Confirm Checkout
                </Button>
            </div>
        </div>
    );
}

export default Checkout;
