import { useEffect, useState } from "react";
import { Table, Button, Tag, message } from "antd";
import api from "../services/api";
import PositionDrawerForm from "../components/PositionDrawerForm";

export default function PositionsList() {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);

  const fetchPositions = async () => {
    try {
      const res = await api.get("/teacher-positions");
      setData(res.data);
    } catch {
      message.error("Failed to load positions");
    }
  };

  useEffect(() => {
    fetchPositions();
  }, []);

  const columns = [
    { title: "Code", dataIndex: "code" },
    { title: "Name", dataIndex: "name" },
    { title: "Description", dataIndex: "des" },
    {
      title: "Active",
      dataIndex: "isActive",
      render: (v) => (
        <Tag color={v ? "green" : "red"}>
          {v ? "Active" : "Inactive"}
        </Tag>
      ),
    },
  ];

  return (
    <div>
      <Button type="primary" onClick={() => setOpen(true)}>
        Add Position
      </Button>

      <Table
        rowKey="_id"
        style={{ marginTop: 20 }}
        columns={columns}
        dataSource={data}
      />

      <PositionDrawerForm
        open={open}
        onClose={() => setOpen(false)}
        onSuccess={() => {
          setOpen(false);
          fetchPositions();
        }}
      />
    </div>
  );
}
