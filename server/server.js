import express  from "express";
import cors from "cors";  
import bodyParser from "body-parser";
import mysql from "mysql";

const app = express();
const db = mysql.createConnection({
    host:"localhost",
    user:"ettracker1",
    password:"ettracker1",
    database:"ettracker"

});

app.use(express.json());
app.use(bodyParser.json());
app.use(cors({
    origin:"http://localhost:3000",
    method:["POST","GET"],
    Credential:true,
    }
));

const Routerpath = express.Router();
Routerpath.get("/",(req,res)=>{
    return res.json({Status:"",Message:"running on default"});
});

Routerpath.get("/getBankAccountName",(req,res)=>{
    //bank account 
    const bankSql = "SELECT * FROM `bankaccpuntname` where flag = 1";
    db.query(bankSql,(err,data)=>{ 
        if(err || data.length === 0)  res.json({status:"Not Success",err:"1",errData:err});
        if(data.length > 0)  res.json({bankstatus:"Success",bankdbdata:data}); 
    });  
});

Routerpath.get("/getExpCategory",(req,res)=>{     
    //category account
    const categorySql = "SELECT * FROM `expcategory` where flag = 1";
    db.query(categorySql,(err,data)=>{ 
        if(err || data.length === 0)  res.json({status:"Not Success",err:"1",errData:err});
        if(data.length > 0)  res.json({categorystatus:"Success",categorydbdata:data}); 
    }); 
    
});
    

Routerpath.post('/login',(req,res)=>{
    const sql = "select * from login where email = ? AND password = ?";
    db.query(sql,[req.body.email, req.body.password], (err,data)=>{
        //return res.json({resStatus:"Success",queryData:"2",Data:data});
        if(err || data.length === 0) return res.json({resStatus:"Not Success",queryData:"1",errData:err});

        if(data.length > 0) return res.json({resStatus:"Success",queryData:"2",Data:data}); 
        
        })
});

Routerpath.post('/addTransactionData',(req,res)=>{ 
    const sql = "INSERT INTO `transactions`(`amount`, `catId`, `bankId`, `transactionType`, `transactionDate`) VALUES (?,?,?,?,?)";
    db.query(sql,[req.body.amount, req.body.categoryId,req.body.bankAccountId,req.body.tractionType,req.body.transactionDate], (err,data)=>{
        //return res.json({retrunData:data});
        if(data.insertId === 0) return res.json({addDataStatus:"Not Success",errData:err});

        if(data.insertId > 0) return res.json({addDataStatus:"Success",errData:err}); 
        
    })
}); 


// end settings
app.listen(9000,()=>{
    console.log("running");
});
app.use("/",Routerpath);