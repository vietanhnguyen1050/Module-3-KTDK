import { useEffect, useState } from "react";
import './SellRequest.css';
import { fetchAllUsers } from "../../FetchData";
import RequestCard from "./RequestCard/RequestCard";

function SellRequest() {
    const [pendingRequests, setPendingRequests] = useState([]);

    const fetchSellRequests = async () => {
        try {
            const users = await fetchAllUsers();
            const requests = users.flatMap(user =>
                (user.sellhistory || [])
                    .filter(item => item.sold === false && item.isPending === true)
                    .map(item => ({
                        email: user.email,
                        sellhistory: [item]
                    }))
            );
            setPendingRequests(requests);
        } catch (error) {
            console.error("Error fetching sell requests:", error);
        }
    };

    useEffect(() => {
        fetchSellRequests();
    }, []);

    return (
        <div className="history-container">
            <div className="history">
                <h1>Sell Request From Customers</h1>
            </div>
            {pendingRequests.map((request, index) => (
                <RequestCard key={index} email={request.email} carname={request.sellhistory[0]?.carname} price={request.sellhistory[0]?.price} sold={request.sellhistory[0]?.sold} plate={request.sellhistory[0]?.plate} isPending={request.sellhistory[0]?.isPending} contact={request.sellhistory[0]?.contact} />
            ))}
            <p style={{ color: "white" }}>No more requests</p>
        </div>

    );
}

export default SellRequest;