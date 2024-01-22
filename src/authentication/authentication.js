import jwt from 'jsonwebtoken'
import Customer from '../models/customer'
import User from '../models/user'
import dotenv from 'dotenv'
dotenv.config()
class authentication{
static customerAuth = async(request, response, next) => {
    try {
        const token = request.header('Authorization').replace('Bearer ','')
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const customer = await Customer.findOne({ _id: decoded._id, 'tokens.token': token })
        if (!customer) {
            return response.send('Please authenticate!')
        }
        else{
        request.token = token
        request.customer = customer
        next()
        }
    } catch (e) {
        response.status(500).send(e)
    }
}

static userAuth = async (request, response, next) => {
    try {
      const token = request.headers.token;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findOne({
        _id: decoded._id,
        "tokens.token": token,
      });
      if (!user) {
        return response.status(401).send("Please authenticate!");
      }
  else{
      request.token = token;
      request.user = user;
      next();
  }
    } catch (e) {
      response.send(e);
    }
  };

  static isAdmin = async (request, response, next) => {
    try {
      const token = request.headers.token;
      if (!token) {
        return response.status(401).send("Please authenticate!");
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
      const user = await User.findOne({
        _id: decoded._id,
        isAdmin: true,
        "tokens.token": token,
      });
      if (!user) {
        return response.status(401).send("Please authenticate!");
      }
      else{
      request.token = token;
      request.user = user;
      }
      next();
    } catch (e) {
      response.send(e);
    }
  };
}
export default authentication