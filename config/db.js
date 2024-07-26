const mongoose = require('mongoose')
mongoose.set('strictQuery',true)
const URL ="mongodb://localhost:27017"

const connect = async ()=>{
    try {
        await mongoose.connect(URL,{
            // useNewUrlParser:true,
            // useUnifiedTopology:true,
        })
        console.log('ket noi thanh cong roi ')
       
    } catch (error) {
        console.log(error)
        console.log('ket noi that bai ')
    }
}
module.exports={connect}