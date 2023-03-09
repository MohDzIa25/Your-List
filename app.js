const express=require("express");
const mongoose = require('mongoose');
const bodyParser=require("body-parser");
const app=express();
const date=require(__dirname+"/date.js");
const _=require("lodash");

// const items=["Wakeup","Fresh"];
// const workItems=["Code"];

// .....................Mongoose...............................


async function main() {
    try{
        await mongoose.connect('mongodb+srv://admin-zia:UzW463ThaF-BPB.@cluster0.0rbdjdc.mongodb.net/ToDoList');
        console.log("Server Connected");
    }
    catch(err)
    {
        console.log(err);
    }
  
}
main();
const itemSchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    }
  });
  const item=mongoose.model("item",itemSchema);
  const listSchema=mongoose.Schema({
    name:String,
    items:[itemSchema]
  });
  const list=mongoose.model("list",listSchema);
//   const work=mongoose.model("workItem",WorkSchema);


 


//............................................................
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));


app.get("/",(req,res)=>{
    const getlist=async ()=>{
        try{
            const currList=await list.findOne({name:"Today"});
            if(!currList)
            {
                const item1=new item({name:"Demo item"});
                const item2=new item({name:"To add item click +"});
                const item3=new item({name:"To remove item select checkbox"});
                const newlist=new list({name:"Today",items:[item1,item2,item3]});
                  newlist.save().catch((err)=>{
                      console.log("Error in adding default items "+err);
                    });
            }
            const homeList=await list.findOne({name:"Today"});
            const dateString=date.getDate();
            res.render("list",{listTitle:dateString,Lists:homeList});  
        }
        catch(error){
            console.log("Error in reading home page list "+error);
        }
    }
    getlist();
});

app.post("/",(req,res)=>{
    if(req.body.button==="Today")
    {
        const getlist=async()=>{
            try{
                const currlist=await list.findOne({name:"Today"});
                const newItem=new item({name:req.body.item});
                currlist.items.push(newItem);
                currlist.save();
                res.redirect("/");
            }
            catch(err){
                console.log("Error in adding new item in home list "+err);
            }
        }
        getlist();
    }
    else
    {
        const getlist=async()=>{
            try{
                const currlist=await list.findOne({name:req.body.button});
                const newItem=new item({name:req.body.item});
                currlist.items.push(newItem);
                currlist.save();
                res.redirect("/"+currlist.name);
            }
            catch(err){
                console.log("Error in adding new item in home list "+err);
            }
        }
        getlist();
    }
    
});


app.post("/delete",(req,res)=>{
    if(req.body.listName==="Today")
    {
        const getlist=async()=>{
            try{
                const currlist=await list.findOne({name:"Today"});
                currlist.items.splice(currlist.items.findIndex(a=>a.id===req.body.deleteItem),1);
                currlist.save();
                res.redirect("/");
            }
            catch(err){
                console.log("Error in deleting item in home list "+err);
            }
        }
        getlist();

    }
    else
    {
        const getlist=async()=>{
            try{
                const currlist=await list.findOne({name:req.body.listName});
                currlist.items.splice(currlist.items.findIndex(a=>a.id===req.body.deleteItem),1);
                currlist.save();
                res.redirect("/"+req.body.listName);
            }
            catch(err){
                console.log("Error in deleting item in "+req.body.listName+" list "+err);
            }
        }
        getlist();
    }
});


app.get("/about",(req,res)=>{
    res.render("about");
});

app.post("/search",(req,res)=>{
    res.redirect("/"+_.capitalize(req.body.search));
});

// app.get("/work",(req,res)=>{
//     const getwork= async ()=>  {
//         try{
//             const workItems=await work.find();
//             res.render("list",{listTitle:"Work",newItems:workItems});
//         }
//         catch(error){
//             console.log("Error while reading work items"+error);
//         }
//     }
//     getwork();
// });

app.get("/:topic",(req,res)=>{
    const listname=req.params.topic;
    const findList=async()=>{
        try{
            let currlist=await list.findOne({name:listname});
            if(!currlist)
            {
                const item1=new item({name:"Demo item"});
                const item2=new item({name:"To add item click +"});
                const item3=new item({name:"To remove item select checkbox"});
                const newlist=new list({name:listname,items:[item1,item2,item3]});
                  newlist.save().catch((err)=>{
                      console.log("Error in adding default items "+err);
                    }); 
            }
            currlist=await list.findOne({name:listname});
            res.render("list",{listTitle:currlist.name,Lists:currlist});
        }
        catch(error){
            console.log("Error in finding/creating new list "+error);
        }
    }
    findList();
});

app.listen("3000",()=>{
    console.log("Server is running on port 3000");
});