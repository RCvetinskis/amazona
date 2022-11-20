import axios from "axios";
import React, { useContext, useRef, useEffect } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { StoreContext } from "../context/mainContext";
import { getError } from "../utils";

const SignUpScreen = () => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const redirectInUrl = new URLSearchParams(search).get("redirect");

  const redirect = redirectInUrl ? redirectInUrl : "/";

  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();
  const nameRef = useRef();

  const { state, dispatch: ctxDispatch } = useContext(StoreContext);
  const { userInfo } = state;

  const submitHandler = async (e) => {
    e.preventDefault();

    if (passwordRef.current.value !== confirmPasswordRef.current.value) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      const { data } = await axios.post("/api/signup", {
        email: emailRef.current.value,
        name: nameRef.current.value,
        password: passwordRef.current.value,
        confirmPassword: confirmPasswordRef.current.value,
      });
      console.log(data);
      if (data.error) {
        toast.error(data.message);
      } else {
        //sets payload to user signin if user found
        ctxDispatch({ type: "USER_SIGNIN", payload: data.data });
        localStorage.setItem("userInfo", JSON.stringify(data.data));
        navigate(redirect || "/");
      }
    } catch (err) {
      toast.error(getError(err));
    }
  };
  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  return (
    <Container className="small-container">
      <Helmet>
        <title>Sign Up</title>
      </Helmet>
      <h1 className="my-3">Sign Up</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control type="text" required ref={nameRef}></Form.Control>
        </Form.Group>
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" required ref={emailRef}></Form.Control>
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            required
            ref={passwordRef}
          ></Form.Control>
        </Form.Group>
        <Form.Group className="mb-3" controlId="confirmpPassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            required
            ref={confirmPasswordRef}
          ></Form.Control>
        </Form.Group>
        <div className="mb-3">
          <Button type="submit">Sign Up</Button>
        </div>
        Already have an account?{" "}
        <Link to={`/signin?redirect=${redirect}`}>Sign-In</Link>
      </Form>
    </Container>
  );
};

export default SignUpScreen;
