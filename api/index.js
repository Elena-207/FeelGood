import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "./models/User.js";
import Place from "./models/Place.js";
import Booking from "./models/Booking.js";
import cookieParser from "cookie-parser";
import imageDownloader from "image-downloader";
import { fileURLToPath } from "url";
import { dirname } from "path";
import multer from "multer";
import fs from "fs";

dotenv.config();
const app = express();

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9";

app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true, origin: "http://localhost:5173" }));

//---------------------------------------------

mongoose.connect(process.env.MONGO_URL);

//---------------------------------------------

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use("/uploads", express.static(`${__dirname}/uploads`));
//---------------------------------------------

function getUserDataFromReq(req) {
  return new Promise((resolve, reject) => {
    jwt.verify(req.cookies.token, jwtSecret, {}, async (err, user) => {
      if (err) throw err;
      resolve(user);
    });
  });
}

//--------------------------------------------


app.get("/test", (req, res) => {
  res.json("success");
});

//register new user
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userDoc = await User.create({
      name,
      email,
      password: bcrypt.hashSync(password, bcryptSalt),
    });

    res.json(userDoc);
  } catch (error) {
    return res.status(500).json({ error });
  }
});

//login user
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const userDoc = await User.findOne({ email });
  if (userDoc) {
    const passwordOk = bcrypt.compareSync(password, userDoc.password);
    if (passwordOk) {
      jwt.sign(
        { id: userDoc._id, name: userDoc.name, email: userDoc.email },
        jwtSecret,
        {},
        (err, token) => {
          if (err) throw err;
          res.cookie("token", token).json(userDoc);
        }
      );
    } else {
      res.json("password incorrect");
    }
  } else {
    res.json("not found");
  }
});

app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, jwtSecret, {}, (err, user) => {
      if (err) throw err;
      res.json(user);
    });
  } else {
    res.json("not found");
  }
});

//logout the user by clearing the cookie and returning true
app.post("/logout", (req, res) => {
  res.cookie("token", "").json(true);
});

//upload photo by link
app.post("/upload-by-link", async (req, res) => {
  const { link } = req.body;
  const newPhoto = "photo_" + Date.now() + ".jpg";
  await imageDownloader.image({
    url: link,
    dest: `${__dirname}/uploads/${newPhoto}`,
  });
  res.json(newPhoto);
});

//upload picture from local device
//use multer package to upload picture
const photosMiddleware = multer({ dest: "uploads/" });

app.post("/upload", photosMiddleware.array("photos", 100), async (req, res) => {
  const uploadedFiles = [];
  for (let i = 0; i < req.files.length; i++) {
    const { path, originalname } = req.files[i];
    const parts = originalname.split(".");
    const extension = parts[parts.length - 1];
    const newPath = path + "." + extension;
    fs.renameSync(path, newPath);
    uploadedFiles.push(newPath.replace("uploads/", ""));
  }
  res.json(uploadedFiles);
});

// create a new place
app.post("/places", (req, res) => {
  // console.log("Received data:", req.body);
  const { token } = req.cookies;
  const {
    title,
    address,
    addPhoto,
    description,
    features,
    moreInfo,
    checkIn,
    checkOut,
    guestNum,
    price,
  } = req.body;
  jwt.verify(token, jwtSecret, {}, async (err, user) => {
    if (err) throw err;
    const placeDoc = await Place.create({
      owner: user.id,
      title,
      address,
      photos: addPhoto,
      description,
      features,
      moreInfo,
      checkIn,
      checkOut,
      guestNum,
      price,
    });
    res.json(placeDoc);
  });
});

// display the new place
app.get("/user-places", (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, jwtSecret, {}, async (err, user) => {
    const { id } = user;
    res.json(await Place.find({ owner: id }));
  });
});

// display the new place based on the id
app.get("/places/:id", async (req, res) => {
  const { id } = req.params;
  res.json(await Place.findById(id));
});

//update the new place
app.put("/places/:id", async (req, res) => {
  const { token } = req.cookies;
  const {
    id,
    title,
    address,
    addPhoto,
    description,
    features,
    moreInfo,
    checkIn,
    checkOut,
    guestNum,
    price,
  } = req.body;

  jwt.verify(token, jwtSecret, {}, async (err, user) => {
    if (err) throw err;
    const placeDoc = await Place.findById(id);
    if (user.id === placeDoc.owner.toString()) {
      placeDoc.set({
        title,
        address,
        photos: addPhoto,
        description,
        features,
        moreInfo,
        checkIn,
        checkOut,
        guestNum,
        price,
      });
      await placeDoc.save();
      res.json("ok");
    }
  });
});

app.get("/places", async (req, res) => {
  res.json(await Place.find());
});

app.post("/bookings", async (req, res) => {
  const user = await getUserDataFromReq(req);
  const { place, checkIn, checkOut, numOfGuests, name, phone, price } =
    req.body;
  Booking.create({
    place,
    user: user.id,
    checkIn,
    checkOut,
    numOfGuests,
    name,
    phone,
    price,
  }).then((doc) => {
    res.json(doc);
  }).catch((err) => {
    throw err;
  });
});



app.get('/bookings', async (req, res) => {
 const user = await getUserDataFromReq(req);
 res.json(await Booking.find({user:user.id}).populate('place'))
});

app.listen(4000, () => {
  console.log("Server is running... 😸");
});
