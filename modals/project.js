const mongoose=require("mongoose");
const projectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, default: "https://th.bing.com/th/id/OIP.wJb8V7jveleC71U8d8t9lgHaHa?w=146&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3"},
    tags: [String],
    demoUrl: String,
    githubUrl: String
});

const Project = mongoose.model("Project", projectSchema);
module.exports=Project;