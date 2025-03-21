const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

const authRouter = require('./routers/authRouter');

const app = express();
app.use(cors);
app.use(helmet);
app.use(express.json);
app.use(cookieParser);
app.use(express.urlencoded({extended:true}));

mongoose.connect(process.env.MONGO_URI).then(()=>{
    console.log("Database is connected");
}).catch((err)=>{
    console.log(err);
})

app.use('/api/auth', authRouter);

app.get('/',(req,res)=>{
    res.json({message:"HEllo from the sever"});
    console.log('hello')
})

app.listen(PORT = process.env.PORT, ()=>{
    console.log("server is listening to port " + PORT);
})