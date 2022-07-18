const express = require("express");
const app = express();
app.use(express.urlencoded({extended: true}))
const mongoose = require("mongoose");

require('dotenv').config();
const username = process.env.USER_NAME;
const password = process.env.PASSWORD;
const host = process.env.HOST;
const database = process.env.DATABASE;
const mongodbAtlasUsed = process.env.MONGODB_ATLAS_USED;

// connecting to MongoDB
let mongodb_endpoint

if (mongodbAtlasUsed === "true"){
    mongodb_endpoint = `mongodb+srv://${username}:${password}@${host}/${database}?retryWrites=true&w=majority`
} else {
    mongodb_endpoint = `mongodb://${username}:${password}@${host}/${database}?retryWrites=true&w=majority`
}

mongoose.connect(mongodb_endpoint)
    .then(() => {
        console.log("Success: Connected to MongoDB")
    })
    .catch((error) => {
        console.log(error)
        console.error("Failure: Unconnected to MongoDB")
    })

const schema = mongoose.Schema
const blogSchema = new schema({
    title: String,
    summary: String,
    image: String,
    content: String,
});

const blogModel = mongoose.model(
    "blog", // collection name(automatically add 's')
    blogSchema
);

app.get("/blogs", async (req, res) => {
    const allBlogs = await blogModel.find();
    console.log("all blogs:", allBlogs)
    res.send(allBlogs)
})

app.get("/blogs/create", (req, res) => {
    res.sendFile(__dirname + "/views/blogCreate.html")
})

app.get("/blogs/:id", async (req, res) => {
    // TODO:
    // CastError: Cast to ObjectId failed for value "62d4b43509b03db1e611f60" (type string) at path "_id" for model "Blog"
    const blog = await blogModel.findById(req.params.id);
    console.log("blog:", blog)
    if (blog == null) {
        res.send("no such id blog")
    } else {
        res.send(blog)
    }
})

app.post("/blogs", (req, res) => {
    console.log("req content", req.body)
    blogModel.create(req.body, (error, savedBlogData) => {
        if (error) {
            console.log("fail to post blog")
            res.send("fail to post blog")
        } else {
            console.log("success to post blog:", savedBlogData)
            res.send("success to post blog")
        }
    })
})

app.put("/blogs/:id", async (req, res) => {
    blogModel.updateOne({_id: req.params.id}, req.body).exec((error) => {
        if (error) {
            console.log("fail to update blog")
            res.send("fail to update blog")
        } else {
            console.log("success to update blog")
            res.send("success to update blog")
        }
    });
})

app.delete("/blogs/:id", (req, res) => {
    const target = req.params.id;
    console.log("delete:", target)
    blogModel.deleteOne({_id: target}).exec((error) => {
        if (error) {
            console.log("fail to delete")
            res.send("fail to delete")
        } else {
            console.log("success to delete")
            res.send("success to delete")
        }
    })
})

app.listen(5000, () => {
    console.log("listening on localhost port 5000")
})
