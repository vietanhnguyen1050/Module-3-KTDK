import { useEffect, useState } from "react";
import React from "react";
import AddForm from "../addform";
import Details from "../Details";
import { Button } from "antd";
import "./All.css";

export async function fetchData() {
  const api =
    "https://mindx-mockup-server.vercel.app/api/resources/Final?apiKey=689f647d95f60a227657fefc";
  const response = await fetch(api, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const result = await response.json();
  const actual = result.data.data;
  return actual;
}

export async function deleteData(id) {
  const response = await fetch(
    `https://mindx-mockup-server.vercel.app/api/resources/Final/${id}?apiKey=689f647d95f60a227657fefc`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(),
    }
  );
}

async function massDelete(idList) {
  for (const id of idList) {
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
}

function All({ pagekey, onUpdate, refreshKey }) {
  const [data, setData] = useState({ items: [] });

  useEffect(() => {
    async function getData() {
      const fetchedData = await fetchData();
      setData({ items: fetchedData });
    }
    getData();
  }, [refreshKey]);

  const handleUpdate = () => {
    fetchData().then((fetchedData) => {
      setData({ items: fetchedData });
      onUpdate();
    });
    console.log("changed");
  };
  
  const handleDeleteAll = () => {
    const idList = data.items
      .filter((item) => !item.active)
      .map((item) => item._id);
    massDelete(idList).then(() => {
      alert("Deleted all completed tasks!");
      handleUpdate();
    });
  };
  if (pagekey === 1) {
    return (
      <div className="all">
        <AddForm onFormSubmit={handleUpdate}></AddForm>
        {data.items.map((items) => (
          <Details
            onFormSubmit={handleUpdate}
            key={items._id}
            _id={items._id}
            title={items.title}
            active={items.active}
            pagekey={1}
          ></Details>
        ))}
      </div>
    );
  } else if (pagekey === 2) {
    return (
      <div className="all">
        <AddForm onFormSubmit={handleUpdate}></AddForm>
        {data.items
          ?.filter((items) => items.active)
          .map((items) => (
            <Details
              onFormSubmit={handleUpdate}
              key={items._id}
              _id={items._id}
              title={items.title}
              active={items.active}
              pagekey={1}
            ></Details>
          ))}
      </div>
    );
  } else if (pagekey === 3) {
    return (
      <div className="all">
        {data.items
          ?.filter((items) => !items.active)
          .map((items) => (
            <Details
              onFormSubmit={handleUpdate}
              key={items._id}
              _id={items._id}
              title={items.title}
              active={items.active}
              pagekey={3}
            ></Details>
          ))}
        <Button
          onClick={handleDeleteAll}
          className="deleteall"
          type="primary"
          danger
        >
          Delete All Completed
        </Button>
      </div>
    );
  }
}

export default All;
