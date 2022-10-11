import React, { useContext, useEffect, useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom'
import CheckOutSteps from '../componenets/CheckOutSteps'
import { StoreContext } from '../context/mainContext'

const PaymentMethodScreen = () => {
    
    const navigate = useNavigate()
    const {state, dispatch: ctxDispatch} = useContext(StoreContext)

    const { cart: {shippingAddress, paymentMethod} } = state;

    // state to check values of selected payment methods
    const [paymentMethodName, setPaymentMethod] = useState(paymentMethod || "PayPal")


    useEffect(() => {
        // checks if address exists if not navigates to shipping
        if(!shippingAddress.address){
            navigate("/shipping")
        }
     
    }, [shippingAddress, navigate])

    const submitHandler = (e)=>{
        // saves payment method
        e.preventDefault();
        ctxDispatch({type: "SAVE_PAYMENT_METHOD", payload: paymentMethodName})
        localStorage.setItem("paymentMethod", paymentMethodName)
        navigate("/placeorder")
    }
    
  return (
    <div>
        <CheckOutSteps step1 step2 step3 ></CheckOutSteps>
        <div className=" container small-container">
            <Helmet>
                <title>Payment Methid</title>
            </Helmet>
            <h1 className='my-3'>Payment Method</h1>
            <Form onSubmit={submitHandler}>
                <div className="mb-3">
                    <Form.Check
                    type='radio'
                    id="PayPal"
                    label="PayPaL"
                    value="PayPal"
                    checked={paymentMethodName === "PayPal"}
                    onChange={(e)=>setPaymentMethod(e.target.value)}
                    ></Form.Check>
                </div>

                <div className="mb-3">
                    <Form.Check
                    type='radio'
                    id="Stripe"
                    label="Stripe"
                    value="Stripe"
                    checked={paymentMethodName === "Stripe"}
                    onChange={(e)=>setPaymentMethod(e.target.value)}
                    ></Form.Check>
                </div>
                <div className="mb-3">
                    <Button type="submit">Continue</Button>
                </div>
            </Form>
        </div>
    </div>
  )
}

export default PaymentMethodScreen