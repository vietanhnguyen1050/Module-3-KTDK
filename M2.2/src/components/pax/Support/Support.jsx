import { useEffect, useState } from "react";
import { fetchAllUsers } from "../../FetchData";
import Request from "./Request/Request";
import { Form, Input, Button } from "antd";
import { adminFetchSpecificUser } from "../../FetchData";

function Support() {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        fetchAllUsers().then(users => {
            const allRequests = users.flatMap(user =>
                (user.supporthistory || []).map(req => ({
                    ...req,
                    email: user.email
                }))
            );
            setRequests(allRequests);
        });
    }, []);

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            const email = localStorage.getItem("account");
            const user = await adminFetchSpecificUser(email);
            if (!user) {
                alert("User not found!");
                setLoading(false);
                return;
            }
            const supporthistory = Array.isArray(user.supporthistory) ? [...user.supporthistory] : [];
            supporthistory.push({
                name: values.name,
                description: values.description,
                image: values.image,
                status: false,
                response: ""
            });
            const api = `https://mindx-mockup-server.vercel.app/api/resources/users/${user._id}?apiKey=689f647d95f60a227657fefc`;
            await fetch(api, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...user, supporthistory })
            });
            alert("Support request submitted!");
            form.resetFields();
        } catch (e) {
            alert("Failed to submit support request.");
        }
        setLoading(false);
    };

    return (
        <>
            <Form
                form={form}
                className="signup-form"
                name="support"
                style={{ width: "75vw", minWidth: 320, margin: "0 auto" }}
                layout="vertical"
                onFinish={handleSubmit}
            >
                <h1 className="signuptext" style={{ textAlign: "center" }}>Support Request</h1>
                <Form.Item
                    className="signup-form-input"
                    name="name"
                    label="Name of the Issue"
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    rules={[{ required: true, message: "Please input the issue name!" }]}
                >
                    <Input style={{ width: "100%" }} />
                </Form.Item>
                <Form.Item
                    className="signup-form-input"
                    name="description"
                    label="Description"
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    rules={[{ required: true, message: "Please input the description!" }]}
                >
                    <Input.TextArea style={{ width: "100%" }} rows={4} />
                </Form.Item>
                <Form.Item
                    className="signup-form-input"
                    name="image"
                    label="Image URL"
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    rules={[{ required: true, message: "Please input the image URL!" }]}
                >
                    <Input style={{ width: "100%" }} />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" style={{ width: "100%" }} loading={loading} disabled={loading}>
                        Submit
                    </Button>
                </Form.Item>
            </Form>
            <div className="history-container">
                <div className="history">
                    <h1>All Support Requests</h1>
                </div>
                {requests.length > 0 ? (
                    requests.map((req, idx) => (
                        <Request
                            key={idx}
                            name={req.name}
                            description={req.description}
                            image={req.image}
                            status={req.status}
                            response={req.response}
                            email={req.email}
                        />
                    ))
                ) : (
                    <p style={{ color: "white" }}>No support requests found.</p>
                )}
            </div>
        </>
    );
}

export default Support;
