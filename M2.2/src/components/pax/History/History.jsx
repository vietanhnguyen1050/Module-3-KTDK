import { fetchSpecificUser } from "../../FetchData";
import { useState, useEffect } from "react";
import './History.css';
import SellHistoryCard from "./SellHistoryCard/SellHistoryCard.jsx";
import BuyHistoryCard from "./BuyHistoryCard/BuyHistoryCard.jsx";

function History() {
    const [userData, setUserData] = useState(null);

    const fetchUserData = async () => {
        const data = await fetchSpecificUser();
        setUserData(data);
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    return (
        <div className="history-container">
            <div className="history">
                <h1>History</h1>
                {userData ? (
                    <>
                        <div className="sellhistory">
                            <h3 className="title">Sell History</h3>
                            {userData.sellhistory.map((item, index) => (
                                <SellHistoryCard
                                    key={index}
                                    carname={item.carname}
                                    price={item.price}
                                    sold={item.sold}
                                    plate={item.plate}
                                    isPending={item.isPending}
                                />
                            ))}
                            <h4>{userData.sell === false ? "You haven't sell any car!" : null}</h4>
                        </div>
                        <div className="buyhistory">
                            <h3 className="title">Buy History</h3>
                            {userData.buyhistory.map((item, index) => (
                                <BuyHistoryCard
                                    key={index}
                                    carname={item.carname}
                                    price={item.price}
                                    contact={item.contact}
                                    delivered={item.delivered}
                                    done={item.done}
                                />
                            ))}
                            <h4>{userData.boughtnew === false && userData.boughtold === false ? "You haven't buy any car!" : null}</h4>

                        </div>
                    </>
                ) : (
                    <p>Loading...</p>
                )}
            </div>
        </div>
    );
}

export default History;
