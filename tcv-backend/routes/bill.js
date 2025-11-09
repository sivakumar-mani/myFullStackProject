const express = require('express');
const connetion = require('../connection');
const router = express.Router();
const ejs = require('ejs');
let pdf = require('html-pdf');
let path = require('path');
var fs = require('fs');
var uuid = require('uuid');
var auth = require('../services/authentication');
const checkRole = require('../services/checkRole');


router.post('/generateReport', auth.authenticateToken, (req, res) => {
    const generatedUuid = uuid.v1();
    const orderDetails = req.body;
    var productDetailsReport = JSON.parse(orderDetails.productDetails);
    const dir = __dirname;
    const file = "report.ejs";
    const fullPath = path.join(dir, file);
   var query = "insert into bill (uuid, name, email,contactNumber, paymentMethod, total, productDetails, createdBy) VALUES (?,?,?,?,?,?,?,?)";
    connetion.query(query, [generatedUuid, orderDetails.name, orderDetails.email, orderDetails.contactNumber, orderDetails.paymentMethod, orderDetails.total, orderDetails.productDetails, res.locals.email], (err, results) => {
        if (!err) {
            ejs.renderFile(fullPath, { productDetails:productDetailsReport,name:orderDetails.name,email:orderDetails.email,contactNumber:orderDetails.contactNumber,paymentMethod:orderDetails.paymentMethod,total:orderDetails.total }, (err, results) => {
                // console.log(fullPath);
                // console.log(generatedUuid);
                if (err) {
                    return res.status(500).json(err);
                }
                else {
                    pdf.create(results).toFile('./generated_pdf/'+generatedUuid+".pdf", (err, data)=> {
                        console.log(data);
                        if (err) {
                            console.log(err);
                            return res.status(500).json(err);
                        } else {
                            console.log({ uuid: generatedUuid })
                            return res.status(200).json({ uuid: generatedUuid })
                        }
                    })
                }
            })
        }
        else {
            return res.status(500).json(err);
        }
    })
});

router.post('/getpdf', auth.authenticateToken, (req,res)=>{
   const orderDetails = req.body;
   console.log(orderDetails.uuid);
   const pdfPath = './generated_pdf/'+orderDetails.uuid+'.pdf';
   if(fs.existsSync(pdfPath)){
    res.contentType("application/pdf");
    fs.createReadStream(pdfPath).pipe(res);
   }
   else{
     const dir = __dirname;
    const file = "report.ejs";
    const fullPath = path.join(dir, file);
    var productDetails = JSON.parse(orderDetails.productDetails);
      ejs.renderFile(fullPath, { productDetails:productDetailsReport,name:orderDetails.name,email:orderDetails.email,contactNumber:orderDetails.contactNumber,paymentMethod:orderDetails.paymentMethod,total:orderDetails.total }, (err, results) => {
                // console.log(fullPath);
                // console.log(generatedUuid);
                if (err) {
                    return res.status(500).json(err);
                }
                else {
                    pdf.create(results).toFile('./generated_pdf/'+orderDetails.uuid+".pdf", (err, data)=> {
                        console.log(data);
                        if (err) {
                            console.log(err);
                            return res.status(500).json(err);
                        } else {
                           res.contentType("application/pdf");
                            fs.createReadStream(pdfPath).pipe(res);
                        }
                    })
                }
            })
   }
});

router.get('/getBill',auth.authenticateToken,(req,res)=>{
    var query ="select * from bill order by id DESC";
    connetion.query(query,(err, results)=>{
        if(!err){
            return res.status(200).json(results);
        }
        else{
            return res.status(500).json(err);
        }
    })
});

router.delete('/billDelete/:id', auth.authenticateToken,(req, res,next)=>{
    const id = req.params.id;
    var query ="delete from bill where id =?";
    connetion.query(query,[id],(err,results)=>{
       try {
        if(results.affectedRows==0){
            return res.status(404).json({message: " Bill id does not exists"});
        }
        return res.status(200).json({ message: "Bill deleted successfully"});
        
       } catch (error) {
         return res.status(500).json(error);
       }
    })
})
module.exports = router