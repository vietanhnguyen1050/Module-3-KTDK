import { useEffect, useState } from "react";
import { Table, Button, Tag, message, Space } from "antd";
import api from "../services/api";
import TeacherDrawerForm from "../components/TeacherDrawerForm";

export default function TeachersList() {
  const [data, setData] = useState([]);
  const [meta, setMeta] = useState({});
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const fetchTeachers = async (page = 1, limit = 10) => {
    setLoading(true);
    try {
      const res = await api.get(`/teachers?page=${page}&limit=${limit}`);
      setData(res.data.data);
      setMeta(res.data.meta);
    } catch (err) {
      message.error("Failed to load teachers");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const columns = [
    {
      title: "Teacher Code",
      dataIndex: "code",
      width: 120,
    },
    {
      title: "Name",
      render: (_, r) => r.userId?.name
    },
    {
      title: "Identity",
      render: (_, r) => r.userId?.identity
    },
    {
      title: "Email",
      render: (_, r) => r.userId?.email
    },
    {
      title: "Phone",
      render: (_, r) => r.userId?.phoneNumber
    },
    {
      title: "DOB",
      render: (_, r) => r.userId?.dob?.slice(0, 10)
    },
    {
      title: "Address",
      render: (_, r) => r.userId?.address
    },
    {
      title: "Degrees",
      render: (_, r) => (
        <div>
          {r.degrees?.map((d, idx) => (
            <div key={idx}>• {d.type} – {d.school} ({d.year})</div>
          ))}
        </div>
      )
    },
    {
      title: "Positions",
      render: (_, r) => (
        <Space wrap>
          {r.teacherPositions?.map((p) => (
            <Tag key={p._id} color={p.isActive ? "green" : "red"}>
              {p.name}
            </Tag>
          ))}
        </Space>
      )
    },
    {
      title: "Active",
      dataIndex: "isActive",
      render: (v) => (
        <Tag color={v ? "green" : "red"}>
          {v ? "Active" : "Inactive"}
        </Tag>
      )
    }
  ];

  return (
    <div>
      <Button type="primary" onClick={() => setOpen(true)}>
        Add Teacher
      </Button>

      <Table
        rowKey="_id"
        style={{ marginTop: 20 }}
        loading={loading}
        columns={columns}
        dataSource={data}
        pagination={{
          current: meta.page,
          pageSize: meta.limit,
          total: meta.total,
          onChange: (p, l) => fetchTeachers(p, l)
        }}
      />

      <TeacherDrawerForm
        open={open}
        onClose={() => setOpen(false)}
        onSuccess={() => {
          setOpen(false);
          fetchTeachers();
        }}
      />
    </div>
  );
}
