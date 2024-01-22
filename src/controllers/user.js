import User from "../models/user"
import multer from "multer";
// import sharp from "sharp";
import bcrypt from 'bcrypt'
import Email from "../emails/account";
class userController{
static uniqueAccount= async(request, response, next) => {
    try {
        const user = await User.findOne({ email: request.body.email })
        if (user) {
            response.status(401).send({ error: 'Already registered.' })
        }
        else{
        request.user = user
        next()
        }
    } catch (e) {
        response.status(500).send()
    }
}
static createAccount=async (request, response) => {
    const user = new User(request.body);
    try {
      await user.save();
      // Email.sendWelcomeEmail(request.body.email,request.body.lastName)
      //Email.sendOTP(request.body.email,request.body.lastName,response)
      response.status(200).json(user);
    } catch (error) {
      console.log(error);
    }
  }

  static getUsers=async (request, response) => {   
    try {
      const users =await User.find();
      if (!users) {
        return response.status(404).send("No users Found");
      }
      else{
      response.json(users);
      }
    } catch (e) {
      response.send(e);
    }
  }


  static getUserById=async (request, response) => {   
    try {
      const user =await User.findById(request.params.id);
      if (!user) {
        return response.status(404).send("user Not found");
      }
      else{
      response.json(user);
      }
    } catch (e) {
      response.send(e);
    }
  }
  static login = async (req, res) => {
    try {
      const user=await User.findOne({email:req.body.email});
      console.log(user)
      if(!user) return res.status(400).json({message:"Invalid User"})
      const validated=await bcrypt.compare(req.body.password,user.password);
      if(!validated)  return res.status(400).json({message:"Invalid Password"})
      const accessToken=await user.generateAuthToken()
      return res.status(200).json({message:"Successfully Logged In", data:user,token:accessToken})
  } catch (error) {
     return res.status(500).json({message:error.message})
  }
  };
  
  static logout = async (request, response) => {
    try {
      request.user.tokens = request.user.tokens.filter((token) => {
        return token.token !== request.token;
      });
      await request.user.save();
      response.clearCookie("userFile");
      response.send("logged out");
    } catch (e) {
      response.status(500).send(e);
    }
  }
  static logoutAll=async (request, response) => {
    try {
      request.user.tokens = [];
      await request.user.save();
      response.clearCookie("userFile");
      response.send();
    } catch (e) {
      response.status(500).send();
    }
  }
  static profile=async (request, response) => {
    try {
      response.status(200).send(request.user);
    } catch (e) {
      response.status.send(e);
    }
  }
  static updateUser=async (request, response) => {
    const user = await User.findById(request.params.id);
    const updates = Object.keys(request.body);
    const allowedUpdates = [
      "firstName",
      "lastName",
      "email",
      "password",
      "isAdmin",
    ];
    const isValidOperation = updates.every((update) =>
      allowedUpdates.includes(update)
    );
    if (!isValidOperation) {
      return response.status(400).send({ error: "Invalid Update!" });
    }
    try {
      updates.forEach((update) => (user[update] = request.body[update]));
      await user.save();
      response.send(user);
    } catch (e) {
      response.status(400).send();
    }
  }
  static deleteAccount=async (request, response) => {
    try {
      const user = await User.findById(request.params.id);
  
      if ((user._id = request.user._id)) {
        const count = await User.countDocuments({ isAdmin: true });
  
        if (count == 1) {
          response.send("System must have atleast one admin");
        } else {
          await user.remove();
        }
        response.send("Account deletion succesfully done!");
      }
    } catch (e) {
      response.status(500).send(e);
    }
  }

  //upload avatar

  static upload = multer({
    limits: {
      fileSize: 2000000,
    },
    fileFilter(request, file, callback) {
      if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
        return callback(response.send("Only jpg and png allowed"));
      }
      callback(undefined, true);
    },
  });
  // static uploadAvatar=  async (request, response) => {
  //   const buffer = await sharp(request.file.buffer)
  //     .resize({ width: 250, height: 250 })
  //     .png()
  //     .toBuffer();
  //   request.user.avatar = buffer;
  //   await request.user.save();
  //   response.send("Avatar added!");
  // }
  static uploadCallBack=  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
  static getAvatar=async (request, response) => {
    try {
      const user = await User.findById(request.params.id);
      if (!user || !user.avatar) {
        throw new Error();
      }
      response.set("Content-Type", "image/png");
      response.send(user.avatar);
    } catch (e) {
      response.status(404).send(e);
    }
  }
}
export default userController