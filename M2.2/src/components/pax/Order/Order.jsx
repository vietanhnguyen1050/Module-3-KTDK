import { fetchAllCars } from "../../FetchData";
import { useState, useEffect } from "react";
import OrderCard from "./OrderCard/OrderCard";
import { useNavigate } from "react-router";
import { fetchDiscountsFromAPI } from "../../admin/Discount/Discount";

function Order() {
    const [orderCars, setOrderCars] = useState([]);
    const [discounts, setDiscounts] = useState({
        New: 0,
        "Daily Commute": 0,
        "Law Enforcement": 0,
        Display: 0,
        Motorsport: 0,
    });
    const userAccount = localStorage.getItem("account");
    const navigate = useNavigate();

    useEffect(() => {
        fetchAllCars().then(data => {
            const orders = data.filter(car => car.incart === userAccount);
            setOrderCars(orders);
        });
        fetchDiscountsFromAPI().then(setDiscounts);
    }, [userAccount]);

    const handleCheckout = (car) => {
        navigate(`/checkout/${car._id}`);
    };
    const handleremove = async (carId) => {
        const api = `https://mindx-mockup-server.vercel.app/api/resources/cardata/${carId}?apiKey=689f647d95f60a227657fefc`;
        await fetch(api, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ incart: "", confirmonsale: true })
        });
        alert("Removed from cart!");
        navigate("/");
    };

    return (
        <div className="history-container">
            <h2 style={{ color: "white" }}>Your Orders</h2>
            {orderCars.length > 0 ? (
                <div className="OrderList">
                    {orderCars.map((car, idx) => {
                        const discountPercent =
                            discounts[car.status] || discounts[car.usage] || 0;
                        const discountedPrice = car.price - (car.price * discountPercent) / 100;
                        return (
                            <OrderCard
                                key={idx}
                                carname={car.carname}
                                price={discountedPrice}
                                contact={car.contact}
                                status={car.status}
                                discountPercent={discountPercent}
                                onCheckout={() => handleCheckout(car)}
                                onRemove={() => handleremove(car._id)}
                            />
                        );
                    })}
                </div>
            ) : (
                <p style={{ color: "white" }}>No cars in your order.</p>
            )}
        </div>
    );
}

export default Order;
