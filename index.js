import express from "express";
import fs from "fs";
import {dirname} from "path";
import {fileURLToPath} from "url";
import bodyParser from "body-parser";

const _dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3000;

let count = 0;
var filesName = [];
var filesText = [];


function countFiles(req,res,next){
    fs.readdir(_dirname+"/blogs",(err,files)=>{
        if(err) {
            console.error('Error reading directory:', err);
            next();
        }
        // console.log(files);
        count =  files.length;
        filesName = files;
        next();
    })
}

// function filesData(req,res,next){
//     filesName.forEach((file)=>{
//          const data = fs.readFileSync("./blogs"+file,"utf8");
//          filesText.push(data);
//     })
//     next();
// }

function filesData(file){
    var filesText = [];
    for(let i =0; i<file.length;i++){
        // console.log(file[i]);
        const data = fs.readFileSync("./blogs/"+file[i],"utf8");
        // console.log(data)
        filesText.push(data);
    }
    // console.log(filesText);
    return filesText;
}

app.use(countFiles);

// app.use(filesData);

app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended:true}));

app.get("/",(req,res)=>{
    res.render("index.ejs",{
        count: count,
        files: filesName,
        filesText:filesData(filesName)
        // filesText:filesText
    });
    // console.log(filesName);
    // console.log(filesData(filesName));
    // console.log(filesText);

    // console.log(_dirname);
})
app.get("/about",(req,res)=>{
    res.render("about.ejs");     //change render file
})
app.get("/contact",(req,res)=>{
    res.render("contact.ejs");    //change render file
})

app.get("/create",(req,res)=>{
    res.render("create.ejs");    //change render file
})

app.get("/edit/:file",(req,res)=>{
    const file = req.params.file;
    res.render("edit.ejs",{
        editText: fs.readFileSync("./blogs/"+file,"utf8"),
        file: file
    });    //change render file
})

app.post("/createblog",(req,res)=>{
    fs.writeFile(_dirname+`/blogs/${req.body.heading}.txt`,req.body.text,(err) => {
        if (err) throw err;
        // console.log("The file has been saved!");
        res.redirect("/");
      });
})

app.get('/delete/:deleteFile',(req,res)=>{
    const deleteFile = req.params.deleteFile;
    fs.unlink(_dirname+`/blogs/${deleteFile}`,(err) => {
        if (err) throw err;
        // console.log("The file has been deleted!");
        res.redirect("/");
        });
});

app.post('/editblog/:editFile',(req,res)=>{
    const file = req.params.editFile;
    fs.writeFile(_dirname+"/blogs/"+file,req.body.text,(err) => {
        if (err) throw err;
        // console.log("The file has been saved!");
        res.redirect("/");
      });
    // res.render("edit.ejs");
})

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})