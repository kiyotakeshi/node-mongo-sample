const express = require("express");
const app = express();
app.use(express.urlencoded({extended: true}))
const mongoose = require("mongoose");

require('dotenv').config();
const username = process.env.USER_NAME;
const password = process.env.PASSWORD;

// connecting to MongoDB
mongoose.connect(`mongodb+srv://${username}:${password}@sandbox.irjo5.mongodb.net/blogUser?retryWrites=true&w=majority`)
    .then(() => {
        console.log("Success: Connected to MongoDB")
    })
    .catch((error) => {
        console.error("Failure: Unconnected to MongoDB")
    })

const schema = mongoose.Schema
const blogSchema = new schema({
    title: String,
    summary: String,
    image: String,
    content: String,
});

const blogModel = mongoose.model("Blog", blogSchema);

app.get("/", async(req, res) => {
    const allBlogs = await blogModel.find();
    console.log("all blogs:" , allBlogs)
    res.send("fetch all blogs")
})

app.get("/blog/:id", async (req, res) => {
    const blog = await blogModel.findById(req.params.id);
    console.log("blog:", blog)
    res.send("blog page")
})

app.get("/blog/create", (req, res) => {
    res.sendFile(__dirname + "/views/blogCreate.html")
})

app.post("/blog", (req, res) => {
    console.log("req content", req.body)
    blogModel.create(req.body, (error, savedBlogData) => {
        if(error){
            console.log("fail to write data")
            res.send("fail to post blog data")
        } else {
            console.log("success to write data")
            res.send("post blog data")
        }
    })
})

app.listen(5000, () => {
    console.log("listening on localhost port 5000")
})
