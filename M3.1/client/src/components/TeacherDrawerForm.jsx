import {
  Drawer,
  Form,
  Button,
  Input,
  DatePicker,
  Select,
  Space,
  message,
} from "antd";
import api from "../services/api";
import { useEffect, useState } from "react";

export default function TeacherDrawerForm({ open, onClose, onSuccess }) {
  const [positions, setPositions] = useState([]);
  const [form] = Form.useForm();

  const fetchPositions = async () => {
    const res = await api.get("/teacher-positions");
    setPositions(res.data);
  };

  useEffect(() => {
    if (open) fetchPositions();
  }, [open]);

  const onFinish = async (values) => {
    try {
      const body = {
        ...values,
        dob: values.dob.format("YYYY-MM-DD"),
      };

      await api.post("/teachers", body);
      message.success("Teacher created");
      form.resetFields();
      onSuccess();
    } catch (err) {
      message.error(err.response?.data?.message || "Failed");
    }
  };

  return (
    <Drawer title="Create Teacher" width={520} open={open} onClose={onClose}>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item name="name" label="Full Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="email" label="Email" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="identity" label="Identity" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="phoneNumber" label="Phone" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="address" label="Address" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="dob" label="Date of Birth" rules={[{ required: true }]}>
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="teacherPositions"
          label="Positions"
          rules={[{ required: true }]}
        >
          <Select mode="multiple">
            {positions.map((p) => (
              <Select.Option key={p._id} value={p._id}>
                {p.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        {/* Degrees */}
        <Form.List
          name="degrees"
          rules={[
            {
              validator: async (_, v) =>
                v && v.length > 0 ? Promise.resolve() : Promise.reject(),
              message: "Add at least one degree",
            },
          ]}
        >
          {(fields, { add, remove }) => (
            <>
              {fields.map((field) => (
                <Space key={field.key} align="baseline">
                  <Form.Item
                    {...field}
                    name={[field.name, "type"]}
                    rules={[{ required: true }]}
                  >
                    <Input placeholder="Type" />
                  </Form.Item>

                  <Form.Item
                    {...field}
                    name={[field.name, "school"]}
                    rules={[{ required: true }]}
                  >
                    <Input placeholder="School" />
                  </Form.Item>

                  <Form.Item
                    {...field}
                    name={[field.name, "major"]}
                    rules={[{ required: true }]}
                  >
                    <Input placeholder="Major" />
                  </Form.Item>

                  <Form.Item
                    {...field}
                    name={[field.name, "year"]}
                    rules={[{ required: true }]}
                  >
                    <Input placeholder="Year" />
                  </Form.Item>

                  <Form.Item
                    {...field}
                    name={[field.name, "isGraduated"]}
                    rules={[{ required: true }]}
                  >
                    <Select style={{ width: 120 }}>
                      <Select.Option value={true}>Graduated</Select.Option>
                      <Select.Option value={false}>Not Graduated</Select.Option>
                    </Select>
                  </Form.Item>

                  <Button danger onClick={() => remove(field.name)}>
                    Remove
                  </Button>
                </Space>
              ))}
              <Button type="dashed" onClick={() => add()}>
                Add Degree
              </Button>
            </>
          )}
        </Form.List>

        <Space style={{ marginTop: 20 }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" htmlType="submit">
            Create
          </Button>
        </Space>
      </Form>
    </Drawer>
  );
}
