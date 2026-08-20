import { useEffect, useState } from "react";
import { fetchAllUsers } from "../../FetchData";
import Request from "./Request/Request";

function AdminSupport() {
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        fetchAllUsers().then(users => {
            const allRequests = users.flatMap(user =>
                (user.supporthistory || []).map(req => ({
                    ...req,
                    email: user.email,
                    phonenumber: user.phonenumber
                }))
            );
            setRequests(allRequests);
        });
    }, []);

    return (
        <div className="history-container">
            <div className="history">
                <h1>All Support Requests</h1>
            </div>
            {requests.length > 0 ? (
                requests
                    .filter(req => req.name && req.description && req.image)
                    .map((req, idx) => (
                        <Request
                            key={idx}
                            name={req.name}
                            description={req.description}
                            image={req.image}
                            status={req.status}
                            response={req.response}
                            email={req.email}
                            phonenumber={req.phonenumber}
                        />
                    ))
            ) : (
                <p style={{ color: "white" }}>No support requests found.</p>
            )}
        </div>
    );
}

export default AdminSupport;