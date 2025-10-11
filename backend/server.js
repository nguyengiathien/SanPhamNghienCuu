const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

const app=express();
const PORT = 8080;
const SECRET_KEY = 'Pham Gia Han';

//middleware
app.use(cors({credentials:true,origin:"https://localhost3000"}));
app.use(express.json());

//database
let users=[];
let nextUserId=1;

//API sign up
app.post('/api/auth/signup',async(req,res)=>{
  try{
    const {name,email,password,confirmPassword}=req.body;
    if(!name||!email||!password||!confirmPassword){
      return res.status(400).json({message:"Vui lòng nhập đầy đủ thông tin"});
    }
    if (password!=confirmPassword){
      return res.status(400).json({message:"Mật khẩu không khớp"});
    }

    const existingUser=users.find(u=>email===u.email)
    if (existingUser){
      return res.status(400).json({message:"Email đã tồn tại"});
    }
    //hash password
    const hashedPassword = await bcrypt.hash(password,10);
    //add new user
    const newUser = {
      id:nextUserId++,
      name,
      email,
      password:hashedPassword
    };
    users.push(newUser);
    const token = jwt.sign({id:newUser.id,email:newUser.email},SECRET_KEY,{expiresIn:'5h'});
    res.status(201).json({
      message:'Đăng kí thành công',
      users:{id:newUser.id,name:newUser.name,email:newUser.email},
      token
    });
  } catch (err){
    console.error(err);
    res.status(500).json({message:'Lỗi server'});
  }
  
})
app.listen(PORT,()=>{
  console.log(`Backend đang chạy tại http://localhost${PORT}`);
})