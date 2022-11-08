import Messages from "../models/message.js";
import { StatusCodes } from "http-status-codes";
import Users from '../models/User.js'
export const getAllMessages = async (req,res,next)=>{
    try {
    const {user:{userID},params:{id:otherUserID}} = req;
    const messages = await Messages.find({$and:[{users:{$in:[userID]},users:{$in:[otherUserID]}}]}).sort("createdAt");
    if(messages.length === 0){
        return res.status(StatusCodes.OK).json({success:true,message:'you have no messages yet'})
    }
    return res.status(StatusCodes.OK).json({success:true,nbHits:messages.length,messages})
    } catch (error) {
        next(error);  
    }
}
export const sendMessage = async (req,res,next)=>{
    try {
    const {params:{id:receiverID},user:{userID}} = req;
    const message = new Messages({...req.body});
    message.to = receiverID;
    message.users.push(userID);
    message.users.push(receiverID);
    await message.save();
    return res.status(StatusCodes.OK).json({success:true,message})
    } catch (error) {
        next(error);  
    }
}
export const geCHats = async (req,res,next)=>{
    try {
    const {user:{userID:senderID},params:{id:receiverID}} = req;
    const receiver = await Users.findById(receiverID);
    // return res.json({receiver})
    if(!receiver) throw new BadRequestError("no receiver with the provided id");
    let messages = await Messages.find({users:{$in:senderID}});
    if(messages.length === 0) return res.status(StatusCodes.OK).json({success:true,message:`you have no chats yet with ${receiver.name}`})
    return res.status(StatusCodes.OK).json({success:true,nbHits:messages.length,messages})
    } catch (error) {
        next(error);  
    }
}
export const getAllConversations = async (req,res,next)=>{
    try {
        const {user:{userID:senderID}} = req;
        let conversations = await Messages.find({users:{$in:senderID}},{to:1});
        conversations = conversations.map(item => item.to);
        conversations = await Users.find({_id:{$in:[...conversations]}},{name:1}).sort("-createdAt");
    if(conversations.length === 0) return res.status(StatusCodes.OK).json({success:true,message:`you have no conversations yet`});
    
    return res.status(StatusCodes.OK).json({success:true,nbHits:conversations.length,conversations})
    } catch (error) {
        next(error);  
    }
}
export const deleteMessage = async (req,res,next)=>{
    try {
    const {params:{id:messageID},user:{userID}} = req;
    const message = await Messages.findById(messageID);
    if(!message) throw new Error("no message with the provided id");
    if(!message.users.includes(userID) || message.to === userID) throw new Error("you can only delete your own messages");
    await Messages.findByIdAndDelete(messageID);
    return res.status(StatusCodes.OK).json({success:true,message:"message deleted successfully"})
    } catch (error) {
        next(error);
    }
}