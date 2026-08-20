import { useState } from "react";
import { Form, Input, Button } from "antd";
import { Link, useNavigate } from "react-router";
import "./Account.css";
import { fetchAllUsers } from "../../FetchData";

function Account() {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleChangePassword = async (values) => {
        setLoading(true);
        try {
            const currentEmail = localStorage.getItem("account");
            if (!currentEmail) {
                alert("Local storage tampered.");
                setLoading(false);
                return;
            }

            const users = await fetchAllUsers();
            const user = users.find(u => u.email === currentEmail);

            if (!user) {
                alert("User not found.");
                setLoading(false);
                return;
            }

            if (user.password !== values.oldPassword) {
                alert("Old password is incorrect.");
                setLoading(false);
                return;
            }

            const api = `https://mindx-mockup-server.vercel.app/api/resources/users/${user._id}?apiKey=689f647d95f60a227657fefc`;
            const response = await fetch(api, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...user, password: values.newPassword })
            });

            if (response.ok) {
                alert("Password changed successfully!");
                form.resetFields();
            } else {
                alert("Failed to change password.");
            }
        } catch (error) {
            alert("Failed to change password.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="accountoverview">
            <h1 className="signuptext" style={{ textAlign: "center" }}>Account Overview</h1>
            <Form
                form={form}
                className="signup-form"
                name="account-overview"
                style={{ maxWidth: "75vw", minWidth: 320, margin: "0 auto" }}
                layout="vertical"
                onFinish={handleChangePassword}
            >
                <Form.Item
                    className="signup-form-input"
                    name="oldPassword"
                    label="Old Password"
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    rules={[{ required: true, message: "Please input your old password!" }]}
                >
                    <Input.Password style={{ width: "100%" }} />
                </Form.Item>
                <Form.Item
                    className="signup-form-input"
                    name="newPassword"
                    label="New Password"
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    rules={[{ required: true, message: "Please input your new password!" }]}
                >
                    <Input.Password style={{ width: "100%" }} />
                </Form.Item>
                <Form.Item
                    className="signup-form-input"
                    name="confirmNewPassword"
                    label="Confirm New Password"
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    dependencies={["newPassword"]}
                    rules={[
                        { required: true, message: "Please confirm your new password!" },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue("newPassword") === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error("The new passwords do not match!"));
                            },
                        }),
                    ]}
                >
                    <Input.Password style={{ width: "100%" }} />
                </Form.Item>
                <Link to={"/recover"}>Forgot Password?</Link>
                <Form.Item>
                    <Button type="primary" htmlType="submit" style={{ width: "100%" }} loading={loading} disabled={loading}>
                        Change Password
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}
export default Account;