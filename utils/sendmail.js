var nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host:"smtp.gmail.com",
    port:465,
    secure:true,
    auth:{
        user:'lqmaov2004@gmail.com',
        pass:'xgcqwuqthrrqjcmt'
    },
});

module.exports ={transporter};