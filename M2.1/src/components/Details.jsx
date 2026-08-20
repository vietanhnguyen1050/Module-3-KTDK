import { useState } from "react";
import { Checkbox, Tooltip, Button } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import "./Details.css";
function checkCross(checked) {
  if (checked) {
    const cross = { textDecoration: "line-through" };
    return cross;
  }
}
async function uploadChange(id, active) {
  await fetch(
    `https://mindx-mockup-server.vercel.app/api/resources/Final/${id}?apiKey=689f647d95f60a227657fefc`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ active: active }),
    }
  );
}

async function deleteSingle(id) {
  try {
    const res = await fetch(
      `https://mindx-mockup-server.vercel.app/api/resources/Final/${id}?apiKey=689f647d95f60a227657fefc`,
      { method: "DELETE" }
    );
    if (!res.ok) {
      console.error(`Failed to delete ${id}:`, res.status);
    }
  } catch (err) {
    console.error(`Error deleting ${id}:`, err);
  }
}

function Details(props) {
  const [checked, setChecked] = useState(!props.active);
  const id = props._id;
  const handleChange = async (e) => {
    setChecked(!e.target.checked);
    await uploadChange(id, !e.target.checked);
    alert("Task updated successfully!");
    props.onFormSubmit();
  };
  const handleDelete = async () => {
    await deleteSingle(id);
    alert("Task deleted!");
    props.onFormSubmit();
  };

  if (checked && props.pagekey === 3) {
    return (
      <div className="detail">
        <Checkbox onChange={handleChange} defaultChecked={checked}>
          <p style={checkCross(checked)}>{props.title}</p>
        </Checkbox>
        <Button
          className="delete"
          shape="circle"
          icon={<DeleteOutlined />}
          onClick={handleDelete}
        />
      </div>
    );
  } else {
    return (
      <div className="detail">
        <Checkbox onChange={handleChange} defaultChecked={checked}>
          <p style={checkCross(checked)}>{props.title}</p>
        </Checkbox>
      </div>
    );
  }
}
export default Details;
