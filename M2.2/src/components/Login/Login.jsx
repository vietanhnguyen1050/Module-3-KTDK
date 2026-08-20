import { useState } from "react";
import { useNavigate } from "react-router";
import "./Login.css";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input, Flex } from "antd";
import { Link } from "react-router";
import { useAuth } from "../AuthContext.jsx";
import { fetchAllUsers } from "../FetchData.jsx";

async function fetchUserData() {
  return await fetchAllUsers();
}
function Login() {
  const Navigate = useNavigate();
  const [form] = Form.useForm();
  const [admin, setAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setLoginStatus } = useAuth(); // Use AuthContext

  const handleLogin = async (values) => {
    setLoading(true);
    try {
      const users = await fetchUserData();
      if (
        users.some(
          (user) =>
            values.username === "adminecg@gmail.com" &&
            values.password === "12345678"
        )
      ) {
        alert("Admin login successful");
        setAdmin(true);
        setLoginStatus(true);
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("account", "adminecg@gmail.com");
        Navigate("/");
      } else if (
        users.some(
          (user) =>
            user.email === values.username && user.password === values.password
        )
      ) {
        alert("Login successful");
        setLoginStatus(true);
        setAdmin(false);
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("account", values.username);
        Navigate("/");
      } else if (
        users.some(
          (user) =>
            user.email === values.username && user.password !== values.password
        )
      ) {
        alert("Incorrect password");
      } else {
        alert("User not found");
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <Form
      form={form}
      className="login-form"
      name="login"
      initialValues={{ remember: true }}
      style={{ maxWidth: 360 }}
      onFinish={handleLogin}
    >
      <h1 className="logintext">Login</h1>
      <Form.Item
        name="username"
        rules={[{ required: true, message: "Please input your Username!" }]}
      >
        <Input prefix={<UserOutlined />} placeholder="Username" />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{ required: true, message: "Please input your Password!" }]}
      >
        <Input
          prefix={<LockOutlined />}
          type="password"
          placeholder="Password"
        />
      </Form.Item>
      <Form.Item>
        <Flex justify="space-between" align="center">
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>Remember me</Checkbox>
          </Form.Item>
          <Link to={"/recover"}>Forgot password</Link>
        </Flex>
      </Form.Item>

      <Form.Item>
        <Button
          block
          type="primary"
          htmlType="submit"
          loading={loading}
          disabled={loading}
        >
          Log in
        </Button>
        <Link to={"/signup"}>Register now!</Link>
      </Form.Item>
    </Form>
  );
}
export default Login;
