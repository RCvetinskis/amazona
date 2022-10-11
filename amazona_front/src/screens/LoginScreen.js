import  axios  from "axios";
import React, { useContext, useRef, useEffect } from "react";
import { Button, Container , Form} from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { StoreContext } from "../context/mainContext";
import { getError } from "../utils";

const LoginScreen = () => {
    const {search} = useLocation()
    const navigate = useNavigate()
    const redirectInUrl = new URLSearchParams(search).get("redirect")

    const redirect = redirectInUrl ? redirectInUrl : "/"

    const emailRef = useRef()
    const passwordRef = useRef()

    const { state, dispatch: ctxDispatch } = useContext(StoreContext);
    const {userInfo} = state

    const submitHandler = async(e)=>{
      
        e.preventDefault();
      
        try{
            const {data} = await axios.post("/api/signin",{
                email:emailRef.current.value,
                password: passwordRef.current.value
            })
            
            //sets payload to user signin if user found
            ctxDispatch({type: "USER_SIGNIN",payload:data.data})
            localStorage.setItem("userInfo", JSON.stringify(data.data));
            navigate(redirect || "/")
        }catch (err){
            toast.error(getError(err))
        }
    }
    useEffect(() => {
        if(userInfo){
            navigate(redirect)
        }
    }, [navigate, redirect, userInfo])
    
  return (
    <Container className="small-container">
        <Helmet>
            <title>Sign in</title>
        </Helmet>
        <h1 className="my-3">Sign in</h1>
        <Form onSubmit ={submitHandler}>
        <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" required ref={emailRef}>
            </Form.Control>
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" required ref={passwordRef}>
            </Form.Control>
        </Form.Group>
        <div className="mb-3">
            <Button type="submit">Sign in</Button>
        </div>
        New Customer? {" "}
        <Link to={`/signup?redirect=${redirect}`}>Create your account</Link>
        </Form>

    </Container>
  )
};

export default LoginScreen;
