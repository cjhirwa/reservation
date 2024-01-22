import Configuration from "../models/configuration";
import multer from "multer";
class configController{


static getSettings=async (request, response) => {   
    try {
      const settings =await Configuration.find();
      response.json(settings);
      }
     catch (e) {
      response.send(e);
    }
  }


  static updateSettings=async (request, response) => {
    const config = await Configuration.find();
    const updates = Object.keys(request.body);
    const allowedUpdates = [
      "name",
      "address",
      "email",
      "phone"
    ];
    const isValidOperation = updates.every((update) =>
      allowedUpdates.includes(update)
    );
    if (!isValidOperation) {
      return response.status(400).send({ error: "Invalid Update!" });
    }
    try {
      updates.forEach((update) => (config[update] = request.body[update]));
      await config.save();
      response.send(config);
    } catch (e) {
      response.status(400).send();
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
  //   const config = await Configuration.find(); 
  //   config.logo = buffer;
  //   await config.save();
  //   response.send("logo added!");
  // }
  static uploadCallBack=  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
  static getLogo=async (request, response) => {
    try {
      const config = await Configuration.find();
      response.set("Content-Type", "image/png");
      response.send(config.avatar);
    } catch (e) {
      response.status(404).send(e);
    }
  }
}
export default configController