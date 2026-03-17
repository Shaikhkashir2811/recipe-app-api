import express from 'express';
import { db } from './config/db.js';
import { ENV } from './config/env.js';
import { favouritesTable } from './db/schema.js';
import {eq,and } from "drizzle-orm"
// import { use } from 'react';

const app = express();
app.use(express.json());
const port = ENV.PORT || 8001;

app.get("/api/health",(req,res)=>{
    res.status(200).json({"success":true});
});

app.post("/api/favorites", async (req,res)=>{
    try{
        const {userId, receipeId, title, image, cookTime, servings} = req.body;
        if(!userId || !receipeId || !title){
            return res.status(400).json({error:"Missing required fields."});
        }
        const newFavourites = await db.insert(favouritesTable).values({
            userId,receipeId,title,image,cookTime,servings
        }).returning();

        res.status(201).json(newFavourites[0]);
    }
    catch(error){
        console.log("Error adding favourites",error);
        res.status(500).json({error:"Something went wrong"})
    }
});

app.get("/api/favorites/:userId",async(req,res)=>{
    try{
        const {userId} = req.params;

        const userFavorites = await db
        .select()
        .from(favouritesTable)
        .where(eq(favouritesTable.userId,userId));

        res.status(200).json(userFavorites);
    }
    catch(error){
        console.log("Error fetching favourites ",error);
        res.status(500).json({error:"Something went wrong."})
    }
});


app.delete("/api/favorites/:userId/:receipeId",async(req,res)=>{
    try{
        const {userId, receipeId}  = req.params;
        await db.delete(favouritesTable).where(
            and(eq(favouritesTable.userId,userId),eq(favouritesTable.receipeId,parseInt(receipeId))));
            res.status(200).json({message:"Favorite deleted successfully"});
    }
    catch(error){
        console.log("Error removing favourite ",error); 
        res.status(500).json({error:"Something went wrong." })
    }
})




app.listen(port,()=>{
    console.log("Server run on ",port);
})