const dns = require('node:dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

require('dotenv').config();
const express=require("express");
const app=express();
const port = process.env.PORT || 3000;
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const mongoose=require("mongoose");
const Project=require("./modals/project");
const session = require("express-session");
const { MongoStore } = require("connect-mongo");
const multer = require("multer");
const { storage } = require("./cloudinary");
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }
});

const db_url=process.env.ATLASDB_URL;
if (!db_url) {
    throw new Error("ATLASDB_URL is missing from environment variables");
}
async function main(){
    await mongoose.connect(db_url);
}
main().then(()=>{
    console.log("database connected success")
}).catch((err)=>{
    console.log("error occured",err)
})




app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "public")));


const store=MongoStore.create({
    mongoUrl:db_url,
    crypto:{
        secret:"mysupersecretcode"
    },
    touchAfter:24*3600
});

store.on("error",(error)=>{
    console.log("error in mongo store",error);
});

const sessionOptions={
    store:store,
    secret:"mysupersecretcode",
    resave:false,
    saveUninitialized: true,
    cookie:{
        expires: new Date(Date.now() + 7*24*60*60*1000),
        maxAge:7*24*60*60*1000,
        httpOnly:true
    }
}
app.use(session(sessionOptions));
function requireAdmin(req, res, next) {
    if (req.session.isAdmin) {
        return next();
    }

    res.redirect("/login");
}
app.get("/",(req,res)=>{
    res.render("listings/home");
})
app.get("/login", (req, res) => {
    res.render("listings/login", { error: null });
});

app.post("/login", (req, res,next) => {
    if (
        req.body.username === process.env.username &&
        req.body.password === process.env.password
    ) {
        req.session.isAdmin = true;
        return req.session.save((err) => {
        if (err) return next(err);
        res.redirect("/admin");
});
    }

    res.status(401).render("listings/login", {
        error: "Incorrect username or password"
    });
});
app.get("/admin",requireAdmin,(req,res)=>{
    res.render("listings/admin");
})
app.get("/projects",async(req,res)=>{
    const projects=await Project.find();
    res.render("listings/projects",{projects});
})
app.get("/admin/add",requireAdmin,(req,res)=>{
    res.render("listings/new");
})
app.post("/admin/add",requireAdmin,upload.single("image"),async(req,res)=>{
    const tags = (req.body.tags || "")
        .split(",")
        .map(tag => tag.trim())
        .filter(Boolean);
    await Project.create({
        title: req.body.title,
        description:req.body.description,
        image: req.file ? req.file.path : undefined,
        tags,
        demoUrl:req.body.demoUrl,
        githubUrl:req.body.githubUrl
    });
    res.redirect("/projects");
})
app.listen(port,()=>{
    console.log("app is running");
})

app.use((req,res)=>{
    res.send("app is running");
})
