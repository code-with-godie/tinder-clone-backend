import Users from '../models/User.js';
import { StatusCodes } from 'http-status-codes';
import NotFoundError from '../errors/not-found.js'
import BadRequestError from '../errors/bad-request.js'
import UnauthenticatedError from '../errors/unauthenticated.js'

export const getAllUsersAdmin = async (req,res,next)=>{
  try {
    const {user:{userID}} = req;
    const user = await Users.findById(userID);
    if (!user) throw new UnauthenticatedError("no user with the provided id !!!!");
    if (user.role !== 'admin') throw new BadRequestError("FORBIDDEN!!!");
    const users = await Users.find({_id:{$ne:userID}},{password:0});
    if(users.length === 0){
      return res.status(StatusCodes.OK).json({success:true,message:"you have no users yet!"});
    }
    return res.status(StatusCodes.OK).json({success:true,nbHits:users.length,users});
  } catch (error) {
   next(error);
  }
}
export const getAllUsers = async (req,res,next)=>{
  try {
    const {user:{userID}} = req;
    const user = await Users.findById(userID);
    if (!user) throw new UnauthenticatedError("no user with the provided id !!!!");
    const users = await Users.find({_id:{$nin:[userID,...user.matched,...user.dismatched]}},{password:0});
    if(users.length === 0){
      return res.status(StatusCodes.OK).json({success:true,message:"there are no more date left. please refresh!"});
    }
    return res.status(StatusCodes.OK).json({success:true,nbHits:users.length,users});
  } catch (error) {
   next(error);
  }
}
export const getSingleUser = async (req,res,next)=>{
  try {
    const {params:{id:userID}} = req;
    const user = await Users.findOne({_id:{$eq:userID}},{password:0});
    if(!user) throw new NotFoundError("no user with the provided id");
    return res.status(StatusCodes.OK).json({success:true,user});
  } catch (error) {
   next(error);
  }
}
export const register = async (req,res,next)=>{
  try {
    const {body:{password}} = req;
    const user = new Users({...req.body});
    if(!password) throw new BadRequestError("please provide a password");
    if(password.length < 8) throw new BadRequestError("password cannot be less than 8 charactors");
    const hashedPassword = await user.hashPassword();
    user.password = hashedPassword;
    user.profilePic = req.file?.path || "";
    await user.save();
    const {password:removePassword,...newUser} = user._doc;
    return res.status(StatusCodes.CREATED).json({success:true,user:newUser});
    } catch (error) {
    next(error);
  }
  
}
export const login = async (req,res,next)=>{
  try {
    const {body:{email,password}} =  req;
    if(!email || !password) throw new BadRequestError("please provide both email and password!");
    const user = await Users.findOne({email});
    if(!user) throw new UnauthenticatedError("INVALID EMAIL!");      
    const passwordMatched = await user.checkPassword(password);
    if(!passwordMatched) throw new UnauthenticatedError("INVALID PASSWORD!");      
    const token = await user.createToken();
    const {password:removePassword,...newUser} = user._doc;
    return res.status(StatusCodes.CREATED).json({success:true,user:newUser,token});
  } catch (error) {
    next(error);
  }
}
export const updateUser = async (req,res,next)=>{
  try {
    const {params:{id:userID},user:{userID:loggedInUser}} = req;
  let user = await Users.findById(loggedInUser);
  if(!user) throw new NotFoundError("no use with the provided id!");   
  if(userID !== loggedInUser && user.role !== 'admin') throw new BadRequestError("you can only update your own account!");      
  user = await Users.findByIdAndUpdate(userID,{...req.body},{new:true,runValidators:true});
  return res.status(StatusCodes.OK).json({success:true,user})
} catch (error) {
  next(error);
  
}
}
export const deleteUser = async (req,res,next)=>{
  try {
    const {params:{id:userID},user:{userID:loggedInUser}} = req;
    let user = await Users.findById(loggedInUser);
    if(!user) throw new NotFoundError("no use with the provided id!");   
    if(userID !== loggedInUser && user.role !== 'admin') throw new BadRequestError("you can only delete your own account!");      
    user = await Users.findByIdAndDelete(userID);
    return res.status(StatusCodes.OK).json({success:true,message:"account successfully deleted!"})
  } catch (error) {
    next(error);
    
  }
}
export const match = async (req,res,next)=>{
  try {
    const {params:{id:matchingID},user:{userID}} = req;
    let loggedInUser = await Users.findById(userID);
    let matchWith = await Users.findById(matchingID);
    if(!loggedInUser) throw new NotFoundError("no use with the provided id!");   
    if(!matchWith) throw new NotFoundError("no use with the provided id!");
    loggedInUser = await Users.findByIdAndUpdate(userID,{$push:{matched:matchingID}},{new:true,runValidators:true});
    return res.status(StatusCodes.OK).json({success:true,user:loggedInUser,message:`you have liked ${matchWith.name}`})
  } catch (error) {
    next(error);
    
  }
}
export const disMatch = async (req,res,next)=>{
  try {
    const {params:{id:disMatchingID},user:{userID}} = req;
    let loggedInUser = await Users.findById(userID);
    let disMatchWith = await Users.findById(disMatchingID);
    if(!loggedInUser) throw new NotFoundError("no use with the provided id!");   
    if(!disMatchWith) throw new NotFoundError("no use with the provided id!");
    loggedInUser = await Users.findByIdAndUpdate(userID,{$push:{dismatched:disMatchingID}},{new:true,runValidators:true});
    return res.status(StatusCodes.OK).json({success:true,message:`you have disliked ${disMatchWith.name}`})
  } catch (error) {
    next(error);
    
  }
}
export const refresh = async (req,res,next)=>{
  try {
    const {user:{userID}} = req;
    let user = await Users.findById(userID);
    if(!user) throw new NotFoundError("no use with the provided id!");   
    user = await Users.findByIdAndUpdate(userID,{$set:{matched:[],dismatched:[]}},{new:true,runValidators:true});
    return res.status(StatusCodes.OK).json({success:true,message:`you have refreshed the list`})
  } catch (error) {
    next(error);
    
  }
}