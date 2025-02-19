const express= require('express');
const cors=require('cors');
// const dotenv=require('dotenv');
// dotenv.config();
const path = require("path");
const passport =require('passport')
// const { sequelize } = require('./models/Courses');

const PORT=4000;
const app=express();
app.use(cors());
app.use(express.json()); // Добавьте эту строку
// app.use(express.static(path.join(__dirname)));
app.use(passport.initialize());

const courseRouter = require('./routes/coursesRouter'); // Импортируем роутер
const materialRoutes = require('./routes/materialsRouter');
const lessonRoutes   = require('./routes/lessonsRouter');
const exerciseRoutes = require('./routes/exercisesRouter');
const progressRoutes = require('./routes/progressesRouter');
const streamRoutes=require('./routes/streamRouter');
// app.use(express.json());




// app.use(express.static(__dirname+'/public'))



app.use(require('./auth/routes'))

app.use('/api', courseRouter); 
app.use('/api', materialRoutes); 

app.use('/api', lessonRoutes); 
app.use('/api', exerciseRoutes); 

app.use('/api', progressRoutes); 
app.use('/api', streamRoutes); 


// sequelize.sync({ force: false })
//   .then(() => {
//     console.log('База данных синхронизирована');
//   })
//   .catch((error) => {
//     console.error('Ошибка синхронизации базы данных:', error);
//   });
 

// app.use('/api', materialRoutes);
// app.use('/api', lessonRoutes);
// app.use('/api', exerciseRoutes);
// app.use('/api', progressRoutes);




app.listen(PORT,(err)=>{
    if(err){
        process.exit(1);
    }
    console.log(`SERVER RUN AT${{PORT}}`)
});