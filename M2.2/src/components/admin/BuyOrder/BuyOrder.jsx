import { useEffect, useState } from "react";
import { fetchAllUsers } from "../../FetchData";
import BuyCard from "./BuyCard/BuyCard";

function BuyOrder() {
    const [pendingBuys, setPendingBuys] = useState([]);

    const fetchBuyRequests = async () => {
        try {
            const users = await fetchAllUsers();
            const requests = users.flatMap(user =>
                (user.buyhistory || [])
                    .filter(item => !(item.delivered === true && item.done === true))
                    .map(item => ({
                        email: user.email,
                        phonenumber: user.phonenumber,
                        ...item
                    }))
            );
            setPendingBuys(requests);
        } catch (error) {
            console.error("Error fetching buy requests:", error);
        }
    };

    useEffect(() => {
        fetchBuyRequests();
    }, []);

    return (
        <div className="history-container">
            <div className="history">
                <h1>Buy Orders From Customers</h1>
            </div>
            {pendingBuys.map((request, index) => (
                <BuyCard
                    key={index}
                    email={request.email}
                    carname={request.carname}
                    price={request.price}
                    plate={request.plate}
                    phonenumber={request.phonenumber}
                    delivered={request.delivered}
                    done={request.done}
                />
            ))}
            <p style={{ color: "white" }}>No more buy orders</p>
        </div>
    );
}

export default BuyOrder;
