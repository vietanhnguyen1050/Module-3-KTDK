import { useState, useEffect } from "react";
import "./Home.css";
import { Input, Row, Col, Radio } from "antd";
import Homecard from "./HomeCard/Homecard";
import { fetchAllCars } from "../../FetchData.jsx";

function Home() {
  const [cars, setCars] = useState([]);
  const [filterstate, setFilterstate] = useState(3);
  const [filterusage, setFilterusage] = useState(9);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchAllCars().then((data) => {
      setCars(data);

    });
  }, []);

  const handleStateChange = (e) => {
    setFilterstate(e.target.value);
  };

  const handleUsageChange = (e) => {
    setFilterusage(e.target.value);
  };
  const getidx = (carname, status, usage, price, plate) => {
    return cars.findIndex((car) => car.carname === carname && car.status === status && car.usage === usage && car.price === price && car.plate === plate);

  }
  const filteredCars = cars
    .filter(car => {
      return car.confirmonsale === true;
    })
    .filter(car => {
      if (filterstate === 1) return car.status === "New";
      if (filterstate === 2) return car.status === "Old";
      return true; // All
    })
    .filter(car => {
      if (filterusage === 4) return car.usage === "Display";
      if (filterusage === 5) return car.usage === "Motorsport";
      if (filterusage === 6) return car.usage === "Law enforcement";
      if (filterusage === 7) return car.usage === "Service";
      if (filterusage === 8) return car.usage === "Daily commute";
      return true; // All
    })
    .filter(car =>
      car.carname.toLowerCase().includes(searchTerm)
    );

  return (
    <div className="home-container">
      <div className="home">
        <img src="/homeimg.jpeg" alt="" className="home-img" />
        <Input.Search
          variant="outlined"
          className="search"
          placeholder="Look up your desired drive"
          onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
        />
        <Row className="featuredandfilter">
          <Col md={6} className="testcol">
            <h2 className="filtertext">Condition:</h2>
            <Radio.Group
              className="filter"
              onChange={handleStateChange}
              value={filterstate}
              options={[
                { value: 1, label: <span className="filter-label">New</span> },
                { value: 2, label: <span className="filter-label">Old</span> },
                { value: 3, label: <span className="filter-label">All</span> },
              ]}
              optionType="button"
              buttonStyle="solid"
              style={{ display: "flex", flexDirection: "column" }}
            />
            <br />
            <h2 className="filtertext">Previous Usage:</h2>
            <Radio.Group
              className="filter"
              onChange={handleUsageChange}
              value={filterusage}
              options={[
                { value: 4, label: <span className="filter-label">Display</span> },
                { value: 5, label: <span className="filter-label">Motorsport</span> },
                { value: 6, label: <span className="filter-label">Law enforcement</span> },
                { value: 7, label: <span className="filter-label">Service</span> },
                { value: 8, label: <span className="filter-label">Daily commute</span> },
                { value: 9, label: <span className="filter-label">All</span> },
              ]}
              optionType="button"
              buttonStyle="solid"
              style={{ display: "flex", flexDirection: "column" }}
            />
          </Col>
          <Col md={18} className="featured">
            {filteredCars.map((car, idx) => (
              <Homecard key={idx} link={getidx(car.carname, car.status, car.usage, car.price, car.plate)} {...car} />
            ))}
            <p className="no-results">Oops! Guess our garage hasn't got the ride you need!</p>
          </Col>
        </Row>
      </div>
    </div>
  );
}
export default Home;
