module.exports = (app)=>{
    //reta do tipo render
    app.get('/', (req,res)=>{
        res.render('index.ejs')
    })
}