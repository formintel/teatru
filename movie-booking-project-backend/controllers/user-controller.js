import User from "../models/User.js";
import bcrypt from "bcryptjs";
import Bookings from "../models/Bookings.js";
import jwt from "jsonwebtoken";

export const getAllUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find();
  } catch (err) {
    return console.log(err);
  }
  if (!users) {
    return res.status(500).json({ message: "Unexpected Error Occured" });
  }
  return res.status(200).json({ users });
};

export const singup = async (req, res, next) => {
  const { name, email, password } = req.body;
  if (
    !name &&
    name.trim() === "" &&
    !email &&
    email.trim() === "" &&
    !password &&
    password.trim() === ""
  ) {
    return res.status(422).json({ message: "Invalid Inputs" });
  }

  // Verifică dacă există deja un utilizator cu acest email
  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Eroare la verificarea emailului" });
  }

  if (existingUser) {
    return res.status(400).json({ 
      message: "Acest email este deja înregistrat. Te rugăm să folosești alt email sau să te autentifici." 
    });
  }

  const hashedPassword = bcrypt.hashSync(password);
  let user;
  try {
    user = new User({ name, email, password: hashedPassword });
    user = await user.save();
  } catch (err) {
    console.log(err);
    // Verifică dacă este o eroare de cheie duplicată (cazul în care prima verificare nu a prins duplicatul)
    if (err.code === 11000 && err.keyPattern && err.keyPattern.email) {
      return res.status(400).json({ 
        message: "Acest email este deja înregistrat. Te rugăm să folosești alt email sau să te autentifici.",
        error: { code: 11000 }
      });
    }
    return res.status(500).json({ message: "Eroare la înregistrare. Te rugăm să încerci din nou." });
  }
  
  if (!user) {
    return res.status(500).json({ message: "Unexpected Error Occured" });
  }
  
  return res.status(201).json({ id: user._id });
};

export const updateUser = async (req, res, next) => {
  const id = req.params.id;
  const { name, email, password } = req.body;
  if (
    !name &&
    name.trim() === "" &&
    !email &&
    email.trim() === "" &&
    !password &&
    password.trim() === ""
  ) {
    return res.status(422).json({ message: "Invalid Inputs" });
  }
  const hashedPassword = bcrypt.hashSync(password);
  
  let user;
  try {
    user = await User.findByIdAndUpdate(id, {
      name,
      email,
      password: hashedPassword,
    });
  } catch (errr) {
    console.log(errr);
    // Verifică dacă este o eroare de cheie duplicată
    if (errr.code === 11000 && errr.keyPattern && errr.keyPattern.email) {
      return res.status(400).json({ 
        message: "Acest email este deja folosit de alt utilizator.",
        error: { code: 11000 }
      });
    }
    return res.status(500).json({ message: "Eroare la actualizare. Te rugăm să încerci din nou." });
  }
  
  if (!user) {
    return res.status(500).json({ message: "Something went wrong" });
  }
  
  res.status(200).json({ message: "Updated Sucessfully" });
};

export const deleteUser = async (req, res, next) => {
  const id = req.params.id;
  let user;
  try {
    user = await User.findByIdAndRemove(id);
  } catch (err) {
    return console.log(err);
  }
  if (!user) {
    return res.status(500).json({ message: "Something went wrong" });
  }
  return res.status(200).json({ message: "Deleted Successfully" });
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email && email.trim() === "" && !password && password.trim() === "") {
    return res.status(422).json({ message: "Invalid Inputs" });
  }
  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    return console.log(err);
  }
  
  if (!existingUser) {
    return res
      .status(404)
      .json({ message: "Emailul sau parola sunt incorecte" });
  }
  
  const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password);
  
  if (!isPasswordCorrect) {
    return res.status(400).json({ message: "Parola este incorecta" });
  }

  // Generăm token-ul JWT
  const token = jwt.sign(
    { id: existingUser._id, email: existingUser.email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
  
  return res
    .status(200)
    .json({ 
      message: "Login Successfull", 
      id: existingUser._id,
      token: token
    });
};

export const getBookingsOfUser = async (req, res, next) => {
  const id = req.params.id;
  let bookings;
  try {
    bookings = await Bookings.find({ user: id })
      .populate({
        path: "movie",
        select: "title description posterUrl sala numarLocuri pret regizor durata gen"
      })
      .populate("user", "name email");
  } catch (err) {
    console.error("Eroare la preluarea rezervărilor:", err);
    return res.status(500).json({ message: "Nu s-au putut prelua rezervările" });
  }
  
  if (!bookings) {
    return res.status(404).json({ message: "Nu s-au găsit rezervări" });
  }
  
  return res.status(200).json({ bookings });
};

export const getUserById = async (req, res, next) => {
  const id = req.params.id;
  let user;
  try {
    user = await User.findById(id);
  } catch (err) {
    return console.log(err);
  }
  if (!user) {
    return res.status(500).json({ message: "Unexpected Error Occured" });
  }
  return res.status(200).json({ user });
};