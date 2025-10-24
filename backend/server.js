const express = require('express');
const cors = require('cors');
const app=express();
const userRouter = require('./routes/userRoutes');



const PORT = 8080;


//middleware
app.use(cors({credentials:true,origin:"http://localhost:3000"}));
app.use(express.json());

app.use('/api/auth',userRouter);

app.listen(PORT,()=>{
  console.log(`Backend đang chạy tại http://localhost:${PORT}`);
})