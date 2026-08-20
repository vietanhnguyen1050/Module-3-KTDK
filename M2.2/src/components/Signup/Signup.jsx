import { useState } from "react";
import { useNavigate } from "react-router";
import "./Signup.css";
import {
  Button,
  Checkbox,
  Form,
  Input,
} from "antd";
import { fetchAllUsers } from "../FetchData";

function Signup() {
  const api = 'https://mindx-mockup-server.vercel.app/api/resources/users?apiKey=689f647d95f60a227657fefc';
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);

    const users = await fetchAllUsers();
    if (users.some(user => user.email === values.email)) {
      alert("This email is already used.");
      setLoading(false);
      return;
    }

    const data = {
      email: values.email,
      password: values.password,
      phonenumber: values.phone,
      bought: false,
      rated: false,
      sell: false,
      supportrequest: false,
      buyhistory: [
        // { carname: "", progress: "", status: "", image: "", price: 0, description: "", yearofsell: "", usage: "", color: "", transmission: "", engine: "", contact: "", yearofbuy: "", plate: "" }
      ],
      ratehistory: [
        // { carname: "", rating: 0, comment: "", date: "" }
      ],
      sellhistory: [
        // { carname: "", progress: "", status: "", image: "", price: 0, description: "", yearofsell: "", usage: "", color: "", transmission: "", engine: "", contact: "", sold: false, plate: "" }
      ],
      supporthistory: [
        // { date: "", issue: "", description: "", status: false, response: "We will respond to you shortly!" }
      ],
    };
    try {
      const response = await fetch(api, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      alert('User registered successfully');
      navigate("/login");
    } catch (error) {
      console.error('Error registering user:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      form={form}
      className="signup-form"
      name="register"
      style={{ maxWidth: "75vw", minWidth: 320, margin: "0 auto" }}
      scrollToFirstError
      onFinish={onFinish}
    >
      <h1 className="signuptext" style={{ textAlign: "center" }}>Sign up</h1>
      <Form.Item
        className="signup-form-input"
        name="email"
        label="E-mail"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        rules={[
          {
            type: "email",
            message: "The input is not valid E-mail!",
          },
          {
            required: true,
            message: "Please input your E-mail!",
          },
        ]}
      >
        <Input style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item
        className="signup-form-input"
        name="password"
        label="Password"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        rules={[
          {
            required: true,
            message: "Please input your password!",
          },
        ]}
        hasFeedback
      >
        <Input.Password style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item
        className="signup-form-input"
        name="confirm"
        label="Confirm Password"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        dependencies={["password"]}
        hasFeedback
        rules={[
          {
            required: true,
            message: "Please confirm your password!",
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("password") === value) {
                return Promise.resolve();
              }
              return Promise.reject(
              );
            },
          }),
        ]}
      >
        <Input.Password style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item
        className="signup-form-input"
        name="phone"
        label="Phone Number"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        rules={[{ required: true, message: "Please input your phone number!" }]}
      >
        <Input style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item
        name="agreement"
        valuePropName="checked"
        rules={[
          {
            validator: (_, value) =>
              value
                ? Promise.resolve()
                : Promise.reject(new Error("Should accept agreement")),
          },
        ]}
      >
        <Checkbox>
          I have read the <a href="plz agree :)))))" target="_blank" rel="noopener noreferrer">agreement</a>
        </Checkbox>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" style={{ width: "100%" }} loading={loading} disabled={loading}>
          Register
        </Button>
      </Form.Item>
    </Form>
  );
}
export default Signup;
