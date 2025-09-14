import express from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { middleware } from "./middleware";
import { CreateuserSchema,SigninSchema,CreateroomSchema } from "@repo/common/types";
import { prismaClient } from "@repo/db/client";

const app = express();
app.use(express.json());

app.post("/signup",async(req,res)=>{   
    const parsedData = CreateuserSchema.safeParse(req.body);   
    if(!parsedData.success){
        res.json({
            "message" : "Incorrect inputs"
        })
        return ;
    }
    try {
        const user = await prismaClient.user.create({
            data: {
                email: parsedData.data.username,
                // TODO: Hash the pw
                password: parsedData.data.password,
                name: parsedData.data.name
            }
        })
        res.json({
            userId: user.id
        })
    } catch(e) {
        res.status(411).json({
            message: "User already exists with this username"
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

app.listen(3001);