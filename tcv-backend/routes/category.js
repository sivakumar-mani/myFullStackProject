const express= require('express');
const connection = require('../connection');
const router = express.Router();
const auth = require('../services/authentication');
const checkRole = require('../services/checkRole');

router.post('/add', auth.authenticateToken, checkRole.checkRole,(req, res, next)=>{
    let category =req.body;
    query = "INSERT INTO category (name) VALUES(?)";
    connection.query(query, [category.name],(err, results)=>{
        if(!err){
            return res.status(200).json({message: "Record added successfullt"});
        }
        else {
            return res.status(500).json(err);
        }
    })
});

router.get('/get', auth.authenticateToken, checkRole.checkRole,(req, res)=>{
    var query ="SELECT * from category order by name";
    connection.query(query,(err, results)=>{
        if(!err){
            if(results.length === 0){
                return res.status(400).json({ message: "No record found"})
            }
            else {
                return res.status(200).json(results);
            }
        }
        else{
            return res.status(500).json(err);
        }
    })
});

router.patch('/update', auth.authenticateToken, checkRole.checkRole,(req,res, next)=>{
    const product =req.body;
    query = "update category set name=? where id=?";
    connection.query(query,[product.name, product.id], (err, results)=>{
        if(!err){
            if(results.affectedRows ===0){
                return res.status(404).json({ message: "Category id does not match"})
            }
             return res.status(200).json({ message:"Record updated successfully"});
        }
        else {
            return res.status(500).json(err);
        }
    })
})

module.exports = router;