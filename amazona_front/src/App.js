import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import HomeScreen from "./screens/HomeScreen";
import ProductScreen from "./screens/ProductScreen";
import CartScreen from "./screens/CartScreen";
import {
  Navbar,
  Container,
  Badge,
  Nav,
  NavDropdown,
  Button,
} from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useContext, useEffect, useState } from "react";
import { StoreContext } from "./context/mainContext";
import LoginScreen from "./screens/LoginScreen";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ShippingAdressScreen from "./screens/ShippingAdressScreen";
import SignUpScreen from "./screens/SignUpScreen";
import PaymentMethodScreen from "./screens/PaymentMethodScreen";
import PlaceOrderScreen from "./screens/PlaceOrderScreen";
import OrderScreen from "./screens/OrderScreen";
import OrderHistoryScreen from "./screens/OrderHistoryScreen";
import ProfileScreen from "./screens/ProfileScreen";
import { getError } from "./utils";
import axios from "axios";
import SearchBox from "./componenets/SearchBox";
import SearchScreen from "./screens/SearchScreen";

function App() {
  const { state, dispatch: ctxDispatch } = useContext(StoreContext);
  const { cart, userInfo } = state;

  const signoutHandler = () => {
    ctxDispatch({ type: "USER_SIGNOUT" });
    localStorage.removeItem("userInfo");
    localStorage.removeItem("shippingAddress");
    localStorage.removeItem("paymentMethod");
    window.location.href = "/signin";
  };
  const [sideBarIsOpen, setSidebarIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCatgegories = async () => {
      try {
        const { data } = await axios.get(`/api/categories`);
        console.log(data);
        setCategories(data);
      } catch (err) {
        toast.error(getError(err));
      }
    };
    fetchCatgegories();
  }, []);

  return (
    <BrowserRouter>
      <div
        className={
          sideBarIsOpen
            ? "d-flex flex-column site-container active-cont"
            : "d-flex flex-column site-container"
        }
      >
        <ToastContainer position="bottom-center" limit={1}></ToastContainer>
        <header>
          <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
              <Button
                variant="dark"
                onClick={() => setSidebarIsOpen(!sideBarIsOpen)}
              >
                <i className="fas fa-bars"></i>
              </Button>
              <LinkContainer to="/">
                <Navbar.Brand>amazona</Navbar.Brand>
              </LinkContainer>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <SearchBox />
                <Nav className="me-auto w-100 justify-content-end">
                  <Link to="/cart" className="nav-link">
                    Cart
                    {cart.cartItems.length > 0 && (
                      <Badge pill bg="danger">
                        {/* sums items if they are added and displays cart length */}
                        {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                      </Badge>
                    )}
                  </Link>
                  {userInfo ? (
                    <NavDropdown title={userInfo.name} id="basic-nav-dropdown">
                      <LinkContainer to="/profile">
                        <NavDropdown.Item>User Profile</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/orderhistory">
                        <NavDropdown.Item>Order History</NavDropdown.Item>
                      </LinkContainer>
                      <NavDropdown.Divider />
                      <Link
                        className="dropdown-item"
                        to="#signout"
                        onClick={signoutHandler}
                      >
                        Sign Out
                      </Link>
                    </NavDropdown>
                  ) : (
                    <Link className="nav-link" to="/signin">
                      Sign In
                    </Link>
                  )}
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </header>
        <div
          className={
            sideBarIsOpen
              ? "active-nav side-navbar d-flex justify-content-between flex-wrap flex-column"
              : "side-navbar d-flex justify-content-between flex-wrap flex-column"
          }
        >
          <Nav className="flex-column text-white w-100 p-2">
            <Nav.Item>
              <strong>Categories</strong>
            </Nav.Item>
            {categories.map((category) => (
              <Nav.Item key={category}>
                <LinkContainer
                  to={`/search?category=${category}`}
                  onClick={() => setSidebarIsOpen(false)}
                >
                  <Nav.Link>{category}</Nav.Link>
                </LinkContainer>
              </Nav.Item>
            ))}
          </Nav>
        </div>
        <main>
          <Container className="mt-3">
            <Routes>
              <Route path="/product/:slug" element={<ProductScreen />}></Route>
              <Route path="/cart" element={<CartScreen />}></Route>
              <Route path="/search" element={<SearchScreen />}></Route>
              <Route path="/signin" element={<LoginScreen />}></Route>
              <Route path="/signup" element={<SignUpScreen />}></Route>
              <Route path="/profile" element={<ProfileScreen />}></Route>
              <Route path="/placeorder" element={<PlaceOrderScreen />}></Route>
              <Route path="/order/:id" element={<OrderScreen />}></Route>
              <Route
                path="/orderhistory"
                element={<OrderHistoryScreen />}
              ></Route>
              <Route
                path="/shipping"
                element={<ShippingAdressScreen />}
              ></Route>
              <Route path="/payment" element={<PaymentMethodScreen />}></Route>
              <Route path="/" element={<HomeScreen />}></Route>
            </Routes>
          </Container>
        </main>

        <footer>
          <div className="text-center">All rights reserved</div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
