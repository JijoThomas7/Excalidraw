import express from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { middleware } from "./middleware";
import { CreateuserSchema,SigninSchema,CreateroomSchema } from "@repo/common/types";

const app = express();

app.post("/signup",(req,res)=>{
    const data = CreateuserSchema.safeParse(req.body);
    if(!data.success){
        return res.json({
            "message" : "Incorrect inputs"
        })
    }
})

app.post("/signin",(req,res)=>{
    const data = SigninSchema.safeParse(req.body);
    if(!data.success){
        return res.json({
            "message" : "Invalid inputs"
        })
    }
    const userId = 1;
    const token  = jwt.sign({
        userId
    },JWT_SECRET);
    
})

app.post("/room",middleware,(req,res)=>{
    const data = CreateroomSchema.safeParse(req.body);
    if(!data.success){
        return res.json({
            "message" : "Invalid inputs"
        })
        res.json({
            userId:"123"
        })
    }
})

app.listen(3000);