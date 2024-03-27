/********************************************************************************
*  WEB322 – Assignment 05
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
* 
*  https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
* 
*  Name: Wilgard Fils-aime____________ Student ID: 172-519-225______ Date: march 23rd 2024__
*
*  Published URL: ___________________________________________________________
*
********************************************************************************/



const legoData = require("./modules/legoSets");
const path = require("path");
const express = require('express');
const app = express();



const HTTP_PORT = process.env.PORT || 8080;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render("home")
});

app.get('/about', (req, res) => {
  res.render("about");
});

//
app.get('/lego/addSet', async (req, res) => {
  let themes = await legoData.getAllThemes();
  res.render('addSet', { themes: themes });
});

app.post('/lego/addSet', async (req, res) => {
  try {
    await legoData.addSet(req.body);
    res.redirect("/lego/sets");
  } catch (err) {
    const errorMessage = err.message || 'An unknown error occurred.';
    res.render('500', { message: `I'm sorry, but we have encountered the following error: ${errorMessage}` });
    //res.render('500', {message: `I'am sorry, but we have encountered the following error ${err}`})
  }
})


app.get('/lego/editSet/:num', async (req, res) => {
  
  try {
    let set = await legoData.getSetByNum(req.params.num);
    let themes = await legoData.getAllThemes();

    res.render("editSet", { set, themes });
  } catch (err) {
    res.status(404).render("404", { message: err });
  }
})

app.post("/lego/editSet", async (req, res) => {
  
  try {
    await legoData.editSet(req.body.set_num, req.body);
    res.redirect("/lego/sets");
  } catch (err) {
    res.render("500", { message: `I'am sorry, but we have encountered the following error ${err}` });
  }
});


app.get("/lego/sets", async (req,res)=>{

  let sets = [];

  try{    
    if(req.query.theme){
      sets = await legoData.getSetsByTheme(req.query.theme);
    }else{
      sets = await legoData.getAllSets();
    }

    res.render("sets", {sets})
  }catch(err){
    res.status(404).render("404", {message: err});
  }
  
});

app.get("/lego/sets/:num", async (req,res)=>{
  try{
    let set = await legoData.getSetByNum(req.params.num);
    res.render("set", {set})
  }catch(err){
    res.status(404).render("404", {message: err});
  }
});




app.use((req, res, next) => {
  res.status(404).render("404", {message: "I'm sorry, we're unable to find what you're looking for"});
});

legoData.initialize().then(()=>{
  app.listen(HTTP_PORT, () => { console.log(`server listening on: ${HTTP_PORT}`) });
}).catch(err => {
  console.log(err);
});


//class="block text-gray-700 font-medium"
//class="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-blue-300"
