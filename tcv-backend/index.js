const express = require('express');
var cors = require('cors');
const app = express();
const  connection = require('./connection');
const userRouter = require('./routes/user');
const categoryRouter = require('./routes/category');
const productRouter = require('./routes/product');
const billRouter = require('./routes/bill');
const dashboardRouter = require('./routes/dashboard');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use('/api/user', userRouter);
app.use('/api/category', categoryRouter);
app.use('/api/product', productRouter);
app.use('/api/bill',billRouter);
app.use('/api/dashboard', dashboardRouter);

module.exports = app;