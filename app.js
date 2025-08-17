
import express from 'express';
import { main } from './api.js';
import { fileUpload } from './multer.js';
import cors from 'cors';

const app=express();
const PORT=process.env.PORT;

let corsOptions={
    origin:"*",
    method:'GET,PUT,POST',
}

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({extended:true}));


app.get("/",(req,res)=>{
    res.send("Hello AI :)");
});

app.post("/ask",fileUpload,async(req,res)=>{

    try {
        let{content}=req.body; 
        const path=req.file.path; 
        const result=  await main(content,path);
        res.json({result});
        
    } catch (error) {
        console.log(error);
        
        console.log(error.message);
        
    }
});

app.listen(PORT,()=>{
    console.log(`server lisiting on PORT ${PORT}`);
    
});








