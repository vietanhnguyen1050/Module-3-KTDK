import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { Layout, Menu } from "antd";
import TeachersList from "./pages/TeachersList";
import PositionsList from "./pages/PositionsList";

const { Header, Content } = Layout;

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Header>
          <Menu
            mode="horizontal"
            theme="dark"
            items={[
              { key: "1", label: <Link to="/">Teachers</Link> },
              { key: "2", label: <Link to="/positions">Positions</Link> },
            ]}
          />
        </Header>

        <Content style={{ padding: 20 }}>
          <Routes>
            <Route path="/" element={<TeachersList />} />
            <Route path="/positions" element={<PositionsList />} />
          </Routes>
        </Content>
      </Layout>
    </BrowserRouter>
  );
}
