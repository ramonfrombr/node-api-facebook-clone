const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");

const helmet = require("helmet");
const morgan = require("morgan");

const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");

/*

const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = `mongodb+srv://facebookcloneadmin:${process.env.MONGO_URL}@cluster0.h1myi2n.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});*/


/*
mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true}, () => {
    console.log("Connected to MongoDB")
});*/


mongoose.connect(process.env.MONGO_URL);


// middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));


app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);


app.get("/", (request, response) => {
    response.send("Welcome to homepage");
})

app.listen(8800, () => {
    console.log("Backend")
})


