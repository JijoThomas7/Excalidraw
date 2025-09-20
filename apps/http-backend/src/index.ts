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
            "message" : "The given input are incorrect"
        })
        return ;
    }
    try {
        const user = await prismaClient.user.create({
            data: {
                email: parsedData.data.username,
                
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

app.post("/signin",async(req,res)=>{
    const parsedData = SigninSchema.safeParse(req.body);
    if(!parsedData.success){
        res.json({
            "message" : "Invalid credentials" 
        })
        return ;
    }
    const user =await prismaClient.user.findFirst({
        where : {
            email : parsedData.data.username,
            password : parsedData.data.password
        }
    })
    if(!user){
        res.json({
            "message" : "user are not authorized"
        })
        return ;
    }
    const token = jwt.sign({
         userId : user.id
    },JWT_SECRET)

    res.json({
        token
    })
})

app.post("/room",middleware,async(req,res)=>{
    const parsedData = CreateroomSchema.safeParse(req.body);
    if(!parsedData.success){
        res.json({
            "message" : "Invalid credentials" 
        })
        return ;
    }
  //  @ts-ignore
    const userId = req.userId ; 

    try{
    const room = await prismaClient.room.create ({
        data : {
            slug : parsedData.data.roomname,
            adminId : userId
        }
    })

    res.json ({
        roomId : room.id
    })
    }
    catch(e){
        res.status(411).json({
            "message" : "room name already exists"
        })
    }
})

app.listen(3001);