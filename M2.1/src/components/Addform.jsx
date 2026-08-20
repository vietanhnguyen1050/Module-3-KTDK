import { useState } from "react";
import { Button, Input, Space } from "antd";
async function uploadData(data) {
    const api = 'https://mindx-mockup-server.vercel.app/api/resources/Final?apiKey=689f647d95f60a227657fefc';
    await fetch(api, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',},
        body: JSON.stringify(data),
        });
}
function AddForm({onFormSubmit}) {
    const [input, setInput] = useState("");
    const handleChange = (e) => {
        setInput(e.target.value);
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        await uploadData({title: input, active: true});
        setInput("");
        alert("Added successfully!");
        onFormSubmit();
    }
    return (
        <Space>
        <Space.Compact style={{ width: '50vh' }}>
      <Input type="text" placeholder="add details" value={input} onChange={handleChange}/>
      <Button type="primary" onClick={handleSubmit}>Add</Button>
        </Space.Compact>
        </Space>
        
    )
}

export default AddForm;