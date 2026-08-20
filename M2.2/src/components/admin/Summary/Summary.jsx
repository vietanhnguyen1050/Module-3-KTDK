import { fetchSpecificUser } from "../../FetchData";
import { useState, useEffect } from "react";
import './Summary.css';
import SummaryCard from "./SummaryCard/SummaryCard.jsx";

function Summary() {
    const [userData, setUserData] = useState(null);

    const fetchUserData = async () => {
        const data = await fetchSpecificUser();
        setUserData(data.summary);
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    return (
        <div className="history-container">
            <div className="history">
                <h1>Financial Summary</h1>
                {userData ? (
                    <>
                        <div className="summary">
                            {userData.map((item, index) => (
                                <SummaryCard key={index} {...item} />
                            ))}
                        </div>
                    </>
                ) : (
                    <p>Loading...</p>
                )}
            </div>
        </div>
    );
}

export default Summary;
