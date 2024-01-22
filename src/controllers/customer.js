import Customer from "../models/customer";
import Email from "../emails/account";
import bcrypt from "bcryptjs";
class customerController{
    static createAccount=async (request, response) => {
      try {
        const customer = await Customer.findOne({ email: request.body.email })
        if (customer) {
            response.status(200).json({ error: 'Already registered.' })
        }
        else{
          const user = new Customer(request.body);
          const password=request.body.password;
          await user.save();
          Email.sendWelcomeEmail(request.body.email,request.body.firstName,password)
          response.status(200).json(user);
        }
      } catch (error) {
        console.log(error);
      }
    }
    static resetPassword=async (request, response) => {
      try{
      const email=request.body.email;
      const pass=request.body.password;
      let user=await Customer.findOne({email:email})
      user.password=pass;
      await user.save();
      response.send("Password was reset succesfully!");
      } 
      catch (e) {
        response.status(400).send();
      }
    }
    static getCustomerById=async (request, response) => {
        try {
          const customer =await Customer.findById(request.params.id);
          if (!customer) {
            return response.status(404).send("customer Not found");
          }
          else{
          response.status(206).send(customer);
          }
        } catch (e) {
          response.send(e);
        }
      }
static getAll=async (request, response) => {
        try {
          const customers =await Customer.find();
          if (!customers) {
            return response.status(404).send("No customer found");
          }
          else{
          response.status(206).send(customers);
          }
        } catch (e) {
          response.send(e);
        }
}
      static login=async (request, response) => {
        try {
          const email=  request.body.email
          const pass= request.body.password
          const customer = await Customer.findOne({ email });
          if (!customer) {
            return response.send({ error: "Invalid credentials" });
          }
          else{
            const isMatch = await bcrypt.compare(pass, customer.password);
            if (!isMatch) {
              return response.send({ error: "Incorrect password" });
            } else {
              customer.logins=customer.logins+1;
              await customer.save();
              const token = await customer.generateAuthToken();
              return response.send({'token':token});
            }
        }
       } catch (error) {
          response.send(error);
        }
      }
      static deleteAccount=async (request, response) => {
        try {
          const email=  request.body.email
          const pass= request.body.password
          const customer = await Customer.findOne({ email });
          if (!customer) {
            return response.send({ error: "Invalid credentials" });
          }
          else{
            const isMatch = await bcrypt.compare(pass, customer.password);
            if (!isMatch) {
              return response.send({ error: "Incorrect password" });
            } else {
              await customer.remove();
              return response.send('success');
            }
        }
       } catch (error) {
          console.log(error);
        }
      }
      static logout=async (request, response) => {
        try {
          request.customer.tokens = await request.customer.tokens.filter((token) => {
            return token.token !== request.token;
          });
          await request.customer.save();
          response.send("logged out");
        } catch (e) {
          response.status(400).send(e);
        }
      }
      static logoutAll=async (request, response) => {
        try {
          request.customer.tokens = [];
          await request.customer.save();
          response.send();
        } catch (e) {
          response.status(500).send();
        }
      }
      static profile=async (request, response) => {
        response.status(200).send(request.customer);
      }
      static updateProfile=async (request, response) => {
        const updates = Object.keys(request.body);
        const allowedUpdates = [
          "firstName",
          "lastName",
          "email",
          "password",
        ];
        const isValidOperation = updates.every((update) =>
          allowedUpdates.includes(update)
        );
        if (!isValidOperation) {
          return response.status(400).send({ error: "Invalid Update!" });
        }
        try {
          updates.forEach(
            (update) => (request.customer[update] = request.body[update])
          );
          await request.customer.save();
          response.send(request.customer);
        } catch (e) {
          response.status(400).send();
        }
      }
}
export default customerController