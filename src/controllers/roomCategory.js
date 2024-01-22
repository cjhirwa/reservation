import Category from "../models/category";
class categoryController{
  static uniqueCategory = async (request, response, next) => {
    try {
      const category = await Category.findOne({ name: request.body.name });
      if (category) {
        return response.status(401).send({ error: "Already registered." });
      }
      else{
      request.category = category;
      next();
      }
    } catch (e) {
      response.status(500).send();
    }
  }
static createCategory=async (request, response) => {
    const category = new Category(request.body);
    try {
      await category.save();
      response.status(200).json(category);
    } catch (error) {
      console.log(error);
    }
  }
  static getCategoryById=async (request, response) => {
    try {
      const category=await Category.findById(request.params.id);
      if (!category) {
        return response.status(404).send("category Not found");
      }
      else{
      return response.send(category);
      }
    } catch (e) {
      response.send(e);
    }
  }

  static getAll=async (request, response) => {
    try {
      const categories=await Category.find();
      if (!categories) {
        return response.status(404).send("no category found");
      }
      else{
      return response.send(categories);
      }
    } catch (e) {
      response.send(e);
    }
  }


  static getCategoryRooms=async (request, response) => {
    // const sort = {}
    // if (request.query.sortBy) {
    //     const parts = request.query.sortBy.split(':')
    //     sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    // }
    try {
      const category = await Category.findById(request.params.id).populate({
        path: "rooms",
        // options: {
        //     limit: parseInt(request.query.limit),
        //     skip: parseInt(request.query.skip),
        //     sort
        // }
      });
      if (!category.rooms) {
        return response.status(404).send("No room Found");
      }else{
      return response.status(200).send(category.rooms);
      }
    } catch (e) {
      response.send(e);
    }
  }
  static updateCategory=async (request, response) => {
    const category = await Category.findById(request.params.id);
    const updates = Object.keys(request.body);
    const allowedUpdates = ["name"];
    const isValidOperation = updates.every((update) =>
      allowedUpdates.includes(update)
    );
    if (!isValidOperation) {
      return response.status(400).send({ error: "Invalid Update!" });
    }
    try {
      updates.forEach((update) => (category[update] = request.body[update]));
      await category.save();
      response.send(category);
    } catch (e) {
      response.status(400).send();
    }
  }
  static deleteCategory=async (request, response) => {
    try {
      const category = await Category.findById(request.params.id)
      await category.remove();
      if(category){
      return response.send("Category deletion succesfully done!");
      }
      else{
        return response.send("And error occured!");
      }
    } catch (e) {
      response.status(500).send(e);
    }
  }
  static getAvatar=async (request, response) => {
    try {
      const customer = await Customer.findById(request.params.id);
      if (!customer || !customer.avatar) {
        throw new Error();
      }
      else{
      response.set("Content-Type", "image/png");
      response.send(customer.avatar);
      }
    } catch (e) {
      response.status(404).send(e);
    }
  }
}
export default categoryController