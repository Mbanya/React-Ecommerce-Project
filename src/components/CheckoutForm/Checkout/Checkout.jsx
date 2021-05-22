import React, {useState, useEffect} from 'react'
import {Paper, Stepper, Step, StepLabel,Typography,CircularProgress,Divider,Button} from "@material-ui/core";
import useStyles from './styles'
import AddressForm from "../AddressForm";
import PaymentForm from "../PaymentForm";
import {commerce} from "../../../lib/commerce";
import {Link} from "react-router-dom";

const Checkout = ({cart,order,onCaptureCheckout,error}) => {
    const [activeStep, setActiveStep] = useState(0);
    const [checkoutToken, setCheckoutToken] = useState(null);
    const steps = ['Shipping address', 'Payment details'];
    const [shippingData, setShippingData] = useState();
    const classes = useStyles()

    useEffect(()=>{
        const generateToken = async ()=>{
            try {
                const token = await commerce.checkout.generateToken(cart.id, {type: 'cart'});

                console.log(token);
                setCheckoutToken(token);
            }catch (error){

            }

        }
        generateToken();
    },[cart]);
    const nextStep = () => setActiveStep((prevActiveStep) => prevActiveStep + 1);
    const backStep = () => setActiveStep((prevActiveStep) => prevActiveStep - 1);

    const next = (data) => {
        setShippingData(data);
        nextStep();
    }
    let Confirmation = () => order.customer ? (
      <>
          <div>
              <Typography variant={"h5"}>Thank you for your purchase</Typography>
              <Divider className={classes.divider}/>
              <Typography variant={"subtitle2"}>
                  Order ref:
              </Typography>
              <br/>
              <Button variant={"outlined"} component={Link} to={'/'} type={'button'}> Back to Home</Button>
          </div>
      </>
    ) : (
        <div className={classes.spinner}>
            <CircularProgress/>
        </div>
    );

    if (error) {
        Confirmation = () => (
            <>
                <Typography variant="h5">Error: {error}</Typography>
                <br />
                <Button component={Link} variant="outlined" type="button" to="/">Back to home</Button>
            </>
        );
    }
    const Form = () => activeStep === 0 ? <AddressForm checkoutToken={checkoutToken} next={next}/> : <PaymentForm nextStep={nextStep} onCaptureCheckout={onCaptureCheckout} backStep={backStep} checkoutToken={checkoutToken} shippingData={shippingData}/>
    return (
        <>
        <div className={classes.toolbar}/>
            <main className={classes.layout}>
                <Paper className={classes.paper}>
                    <Typography variant={"h4"} align={"center"}>Checkout</Typography>
                    <Stepper activeStep={activeStep} className={classes.stepper}>
                        {steps.map((step)=> (
                            <Step key={step}>
                                <StepLabel>
                                    {step}
                                </StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                    {activeStep === steps.length ? <Confirmation/> : checkoutToken && <Form/>}

                </Paper>
            </main>

        </>
    )
}
export default Checkout