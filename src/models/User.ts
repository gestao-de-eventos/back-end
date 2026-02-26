import { Schema, model, Document } from 'mongoose';

interface user{
    name:string,
    email:string,
    phone:string,
    cpf:string,
    contaSicoob:boolean,
    password:string,
    admin:boolean,
    creatAt:Date
}

const userSchema = new Schema <user>({
    name:{type:String, required:true, minlength:3, maxlength:50},
    email:{type:String, required:true, unique:true, minlength:6, maxlength:50},
    phone:{type:String, required:true,  minlength:10, maxlength:11},
    cpf:{type:String, required:true, unique:true, minlength:11, maxlength:11},
    contaSicoob:{type:Boolean, required:true},
    password:{type:String, required:true, minlength:5},
    admin:{type:Boolean, default:false},
    creatAt:{type:Date, default: Date.now}
})

export const User= model<user>('User', userSchema);