import "./Header.css";
import { useState } from "react";
import { useNavigate } from "react-router";
import { Link, Outlet } from "react-router";
import { Flex, Button } from "antd";
import { useAuth } from "../../AuthContext.jsx";

function Header() {
    const { loginStatus, setLoginStatus, setAdmin } = useAuth();
    const navigate = useNavigate();
    const handleLogout = () => {
        setLoginStatus(false);
        setAdmin(false);
        localStorage.setItem("isLoggedIn", "false");
        localStorage.removeItem("account");
        alert("Logged out successfully");
        navigate("/");
    };

    if (localStorage.getItem("account") === "adminecg@gmail.com") {
        return (
            <Flex justify="space-evenly" align="center" className="header">
                <Link className="headlogo headlink" to={"/"}>
                    EC Garage
                </Link>
                <Flex gap={90} justify="space-evenly" align="center">
                    <Link className="headlink" to="/admin/summary">
                        Financial Summary
                    </Link>
                    <Link className="headlink" to="/admin/discount">
                        Discount
                    </Link>
                    <Link className="headlink" to="/admin/rating">
                        Rating
                    </Link>
                    <Link className="headlink" to="/admin/buyorder">
                        Buy Order
                    </Link>
                    <Link className="headlink" to="/admin/confirmsellrequest">
                        Sell Request
                    </Link>
                    <Link className="headlink" to="/admin/support">
                        Support
                    </Link>
                </Flex>
                <Flex gap={20} justify="space-evenly" align="center">
                    {!loginStatus ? (
                        <>
                            <Link className="headlink" to={"/login"}>
                                Log in
                            </Link>
                            <Link className="headlink" to={"/signup"}>
                                Sign up
                            </Link>
                        </>
                    ) : (
                        <button className="headlink button" onClick={handleLogout}>
                            Log out
                        </button>
                    )}
                </Flex>
            </Flex>
        );
    } else if (localStorage.getItem("isLoggedIn") === "false" || localStorage.getItem("isLoggedIn") === null) {
        return (
            <Flex justify="space-evenly" align="center" className="header">
                <Link className="headlogo headlink" to={"/"}>
                    EC Garage
                </Link>
                <Flex gap={90} justify="space-evenly" align="center"></Flex>
                <Flex gap={20} justify="space-evenly" align="center">
                    {!loginStatus ? (
                        <>
                            <Link className="headlink" to={"/login"}>
                                Log in
                            </Link>
                            <Link className="headlink" to={"/signup"}>
                                Sign up
                            </Link>
                        </>
                    ) : (
                        <button className="headlink button" onClick={handleLogout}>
                            Log out
                        </button>
                    )}
                </Flex>
            </Flex>
        );
    } else if (localStorage.getItem("isLoggedIn") === "true") {
        return (
            <Flex justify="space-evenly" align="center" className="header">
                <Link className="headlogo headlink" to={"/"}>
                    EC Garage
                </Link>
                <Flex gap={90} justify="space-evenly" align="center">
                    <Link to={"/history"} className="headlink">
                        History
                    </Link>
                    <Link to={"/order"} className="headlink">
                        Order
                    </Link>
                    <Link to={"/sellrequest"} className="headlink">
                        Sell
                    </Link>
                    <Link to={"/account"} className="headlink">
                        {localStorage.getItem("account")}
                    </Link>
                </Flex>
                <Flex gap={20} justify="space-evenly" align="center">
                    {!loginStatus ? (
                        <>
                            <Link className="headlink" to={"/login"}>
                                Log in
                            </Link>
                            <Link className="headlink" to={"/signup"}>
                                Sign up
                            </Link>
                        </>
                    ) : (
                        <button className="headlink button" onClick={handleLogout}>
                            Log out
                        </button>
                    )}
                </Flex>
            </Flex>
        );
    }
}
export default Header;
