import { Drawer, Form, Input, Button, Select, Space, message } from "antd";
import api from "../services/api";

export default function PositionDrawerForm({ open, onClose, onSuccess }) {
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      await api.post("/teacher-positions", values);
      message.success("Position created");
      form.resetFields();
      onSuccess();
    } catch (err) {
      message.error(err.response?.data?.message || "Failed");
    }
  };

  return (
    <Drawer title="Create Position" width={400} open={open} onClose={onClose}>
      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Form.Item name="code" label="Code" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="name" label="Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="des" label="Description" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="isActive" label="Active" rules={[{ required: true }]}>
          <Select>
            <Select.Option value={true}>Active</Select.Option>
            <Select.Option value={false}>Inactive</Select.Option>
          </Select>
        </Form.Item>

        <Space>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Space>
      </Form>
    </Drawer>
  );
}
