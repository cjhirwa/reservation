import Stripe from "stripe";
import dotenv from "dotenv"
dotenv.config()
const stripe = new Stripe(process.env.STRIPE_SECRET);

class StripeController{
    static async payment(req,res){
        stripe.ChargesResource.create({
            source:req.body.tokenId,
            amount:req.body.amount,
            currency:'usd'
        },
        (stripeError,stripeRes) =>{
            if(stripeError){
                res.status(500).json(stripeError);
            }
            else{
                res.status(200).json(stripeRes);
            }
        }
        );
    };

    static async stripePay(req,res){
        try {
            const name="Client"
            const {amount} = req.body;
            const paymentIntent = await stripe.paymentIntents.create({
                amount:amount * 100,
                metadata:{name},
                currency:"usd",
                payment_method_types:['card']
            });
            const clientSecret = paymentIntent.client_secret;
            res.status(200).json({message:"payment iNitiated",clientSecret});
        } catch (error) {
            console.log(error);
            res.status(500).json({error:error.message})
        }
    }
}

export default StripeController;