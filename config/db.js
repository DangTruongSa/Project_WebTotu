const mongoose = require('mongoose')
mongoose.set('strictQuery',true)
const URL ="mongodb+srv://baonqps32081:vTZQkTkqw9BpYPPo@cluster0.cuv1nem.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

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