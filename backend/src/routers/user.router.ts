import { Router } from "express";
import { SAMPLE_USERS } from "../data";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import { User, UserModel } from "../models/user.model";
import { HTTP_BAD_REQUEST } from "../constants/http_status";
import bcrypt from 'bcryptjs';

const router = Router();

router.get("/seed", asyncHandler(async (req, res) => {
  const usersCount = await UserModel.countDocuments();
  if (usersCount > 0) {
    res.send("Seed is already done!");
    return;
  }

  await UserModel.create(SAMPLE_USERS);
  res.send("Seed is Done!");
}));


router.post("/login", asyncHandler(async(req, res) => {
  const { email, password } = req.body;
    
  const user = await UserModel.findOne({ email });
  
  if (!user) {
    res.status(HTTP_BAD_REQUEST).send("Email is not registered!");
    return;
  }
  const validPassword = await bcrypt.compare(password, user.password);
  
  if (validPassword) {
      res.send(generateTokenResponse(user));
  } else {
      res.status(HTTP_BAD_REQUEST).send("Incorrect Password!");
  }
}));

router.post("/register", asyncHandler(async (req, res) => {
  const { name, email, password, address } = req.body;
  const user = await UserModel.findOne({ email });
  if (user) {
    res.status(HTTP_BAD_REQUEST).send('User already exist. Please login.');
    return;
  }

  const salt = bcrypt.genSaltSync(10);
  const encryptedPassword = bcrypt.hashSync(password, salt);

  const newUser: User = {
    id: "",
    name,
    email: email.toLowerCase(),
    password: encryptedPassword,
    address,
    isAdmin: false
  };

  const dbUser = await UserModel.create(newUser);
  res.send(generateTokenResponse(dbUser));
}));

const generateTokenResponse = (user: any) => {
    const token = jwt.sign({ id: user.id, email: user.email, isAdmin: user.isAdmin }, process.env.JWT_SECRET!, { expiresIn: "30d" })
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      address: user.address,
      isAdmin: user.isAdmin,
      token: token,
    };
}

export default router;