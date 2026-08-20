import { Card } from "antd";
import "./Homecard.css";
import { useAuth } from "../../../AuthContext.jsx";
import { Link } from "react-router";
import { useEffect, useState } from "react";
import { fetchDiscountsFromAPI } from "../../../admin/Discount/Discount";

function showprice(price) {
    return price.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
}
function Homecard({ carname, status, usage, price, plate, image, link }) {
    const { loginStatus } = useAuth();
    const [discounts, setDiscounts] = useState({
        New: 0,
        "Daily Commute": 0,
        "Law Enforcement": 0,
        Display: 0,
        Motorsport: 0,
    });

    useEffect(() => {
        fetchDiscountsFromAPI().then(setDiscounts);
        setDiscounts(discounts);
    }, []);

    const discountPercent =
        discounts[status] || discounts[usage] || 0;
    const discountedPrice = price - (price * discountPercent) / 100;

    return (
        <Card
            className="homecard p-0"
            cover={
                <div className="homecard-img-wrapper">
                    <img src={image} alt={carname} />
                </div>
            }
        >
            <div className="homecard-info">
                <h3 className="homecard-new mb-2">{status}</h3>
                <h2 className="homecard-name mb-2">{carname}</h2>
                <h2 className="homecard-price mb-2">
                    {showprice(discountedPrice)}
                    {discountPercent > 0 && (
                        <span style={{ color: "#00b018", marginLeft: 8 }}>
                            ({discountPercent}% off)
                        </span>
                    )}
                </h2>
                {loginStatus && (
                    <Link to={`/details/${link}`} id={link} className="homecard-details-link">see details</Link>
                )}
                <br />
            </div>
        </Card>
    );
}
export default Homecard;