const mongoose = require('mongoose')

const conn = async()=>{
    //mongoAtlas
    const atlas = await mongoose.connect('mongodb+srv://userADM2:1976ADM2@fiaptecnico.n7tnr.mongodb.net/todo_list')
}

module.exports = conn