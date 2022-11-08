import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from'jsonwebtoken';

const UserSchema = new mongoose.Schema({
  name:{
    type:String,
    maxlength:[50,'name cannot be more than 50 charactors'],
    minlength:[2,'name cannot be less than 2 charactors'],
    required:[true,'please provide a name!']
  },
  email:{
    type:String,
    required:[true,'please provide a name!'],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please provide a valid email',
    ],
    unique: true
  },
  password:{
    type:String,
    minlength:[8,'password cannot be less than 8 charactors'],
    required:[true,'please provide a password!']
  },
  profilePic:{
    type:String,
    default:""
  },
  role:{
    type:String,
    enum:['normal','admin'],
    default:'normal'
  },
  matched:{
    type:[{type:mongoose.Schema.Types.ObjectId,ref:this}]
  },
  dismatched:{
    type:[{type:mongoose.Schema.Types.ObjectId,ref:this}]
  }
},
{
  timestamps:true
});

UserSchema.methods.createToken = function(){
  return jwt.sign({userID:this._id},process.env.JWT_SECRET,{expiresIn:process.env.JWT_LIFE_TIME});
}
UserSchema.methods.checkPassword = function(password){
  return bcrypt.compare(password,this.password);
}
UserSchema.methods.hashPassword = async function(){
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(this.password,salt);
}
export default mongoose.model("",UserSchema);
