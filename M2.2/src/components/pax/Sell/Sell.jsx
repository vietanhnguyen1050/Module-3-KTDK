import { useState } from "react";
import { Form, Input, Button, Select } from "antd";
import "./Sell.css";
import { fetchSpecificUser } from "../../FetchData";
import { useNavigate } from "react-router";

function Sell() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    const data = {
        ...values,
        status: "Old",
        yearofsell: String(new Date().getFullYear()),
        confirmonsale: false,
        incart: "",
        sold: false,
        isPending: true,
    };
    try {
        const user = await fetchSpecificUser();
        if (user) {
            const id = user._id;
            const api = `https://mindx-mockup-server.vercel.app/api/resources/users/${id}?apiKey=689f647d95f60a227657fefc`;
            const updatedSellHistory = user.sellhistory ? [...user.sellhistory, data] : [data];
            const response = await fetch(api, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...user, sell: true, sellhistory: updatedSellHistory }),
            });
        }
    } catch (error) {
        console.error("Error fetching users:", error);
    }
    setTimeout(() => {
      alert("Your car listing has been submitted!");
      form.resetFields();
      setLoading(false);
        navigate("/history");
    }, 1000);
  };

  return (
    <Form
      form={form}
      className="signup-form"
      name="sell-car"
      style={{ maxWidth: "75vw", minWidth: "50vw", margin: "0 auto" }}
      layout="vertical"
      onFinish={onFinish}
    >
      <h1 className="signuptext" style={{ textAlign: "center" }}>Sell Your Car</h1>
      <Form.Item
        className="signup-form-input"
        name="carname"
        label="Car Name"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        rules={[{ required: true, message: "Please input your car name!" }]}
      >
        <Input style={{ width: "100%" }} />
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
      <Form.Item
        className="signup-form-input"
        name="price"
        label="Price"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        rules={[{ required: true, message: "Please input the price!" }]}
      >
        <Input style={{ width: "100%" }} />
      </Form.Item>
      <Form.Item
        className="signup-form-input"
        name="description"
        label="Description"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        rules={[{ required: true, message: "Please input a description!" }]}
      >
        <Input.TextArea style={{ width: "100%" }} rows={4} />
      </Form.Item>
      <Form.Item
        className="signup-form-input"
        name="mileage"
        label="Mileage"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        rules={[{ required: true, message: "Please input the mileage!" }]}
      >
        <Input style={{ width: "100%" }} />
      </Form.Item>
      <Form.Item
        className="signup-form-input"
        name="usage"
        label="Usage"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        rules={[{ required: true, message: "Please select the usage!" }]}
      >
        <Select style={{ width: "100%" }}>
          <Select.Option value="Daily commute">Daily commute</Select.Option>
          <Select.Option value="Law enforcement">Law enforcement</Select.Option>
          <Select.Option value="Service">Service</Select.Option>
          <Select.Option value="Motorsport">Motorsport</Select.Option>
          <Select.Option value="Display">Display</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item
        className="signup-form-input"
        name="color"
        label="Color"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        rules={[{ required: true, message: "Please input the color!" }]}
      >
        <Input style={{ width: "100%" }} />
      </Form.Item>
      <Form.Item
        className="signup-form-input"
        name="transmission"
        label="Transmission"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        rules={[{ required: true, message: "Please input the transmission!" }]}
      >
                <Select style={{ width: "100%" }}>
          <Select.Option value="Automatic">Automatic</Select.Option>
          <Select.Option value="Sequential">Sequential</Select.Option>
          <Select.Option value="Manual">Manual</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item
        className="signup-form-input"
        name="engine"
        label="Engine"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        rules={[{ required: true, message: "Please input the engine!" }]}
      >
        <Input style={{ width: "100%" }} />
      </Form.Item>
      <Form.Item
        className="signup-form-input"
        name="contact"
        label="Contact Number"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        rules={[{ required: true, message: "Please input the contact number!" }]}
      >
        <Input style={{ width: "100%" }} />
      </Form.Item>
      <Form.Item
        className="signup-form-input"
        name="plate"
        label="License Plate"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        rules={[{ required: true, message: "Please input the license plate!" }]}
      >
        <Input style={{ width: "100%" }} />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" style={{ width: "100%" }} loading={loading} disabled={loading}>
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
}
export default Sell;
