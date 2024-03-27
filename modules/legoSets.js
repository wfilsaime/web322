require('dotenv').config();
const { rejects } = require('assert');
const { resolve } = require('path');
const Sequelize = require('sequelize');
//const setData = require("../data/setData");
//const themeData = require("../data/themeData");

//creating the an object of sequelize to connect to the database
let sequelize = new Sequelize('SenecaDB', 'SenecaDB_owner', 'cr9oZGStl0TC', {
  host: 'ep-sweet-wildflower-a5g9ff6v-pooler.us-east-2.aws.neon.tech',
  dialect: 'postgres',
  port: 5432,
  dialectOptions: {
    ssl: { rejectUnauthorized: false },
  }

});

//sequelize authenticate()
sequelize
  .authenticate()
  .then(() => { console.log(`connection successful`) })
  .catch((err) => { console.log(`connection failed`) });
//creating model 1
const Theme = sequelize.define('Theme',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: Sequelize.STRING
  },
  {
    createdAt: false,
    updatedAt: false
  }
  

);

//creating model 2
const Set = sequelize.define('Set',
  {
    set_num: {
      type: Sequelize.STRING,
      primaryKey: true,
    },
    name: Sequelize.STRING,
    year: Sequelize.INTEGER,
    num_parts: Sequelize.INTEGER,
    theme_id: Sequelize.INTEGER,
    img_url: Sequelize.STRING,
  },
  {
    createdAt: false,
    updatedAt: false,
  }
)
//relationship between the models
Set.belongsTo(Theme, { foreignKey: 'theme_id' });






//let sets = [];

// function initialize() {
//   return new Promise((resolve, reject) => {
//     setData.forEach(setElement => {
//       let setWithTheme = { ...setElement, theme: themeData.find(themeElement => themeElement.id == setElement.theme_id).name }
//       sets.push(setWithTheme);
//       resolve();
//     });
//   });

// }

 function initialize() {
  return new Promise(async(resolve, reject) => {
    try {
      await sequelize.sync();
      resolve();
    } catch (err) {
      reject(err.message);
    }
  })
}

function getAllSets() {
  return new Promise(async(resolve, reject) => {
    let sets = await Set.findAll({ include: [Theme] })
    resolve(sets);
  });
}

function getAllThemes() {
  return new Promise(async (resolve, reject) => {
    let themes = await Theme.findAll();
    resolve(themes);
  })
}

function getSetByNum(setNum) {
  return new Promise(async(resolve, reject) => {
    let foundSet = await Set.findAll({ include: [Theme], where: { set_num: setNum } });
    
    if (foundSet.length > 0) {
      resolve(foundSet[0]);
    } else {
      reject("Unable to find requested set");
    }
  });

}

function getSetsByTheme(theme) {

  return new Promise(async(resolve, reject) => {
    let themes = await Set.findAll({
      include: [Theme], where: {
        '$Theme.name$': {
        [Sequelize.Op.iLike]: `${theme}%`
      }
    }});
    resolve(themes);
  });

}

//add sets
function addSet(setData){
  return new Promise(async (resolve, reject) => {
    try {
      await Set.create(setData);
      resolve();
    } catch (err) {
      reject(err);
      throw err;
      //reject(err.errors[0].message);
    }

  });
}


//
function editSet(set_num1, setData) {
  return new Promise(async (resolve, reject) => {
    try {
      await Set.update(setData, { where: { set_num: set_num1 } });
      resolve();
    } catch (err) {
      reject(err.errors[0].message);
    }
  });
}

//
function deleteSet(set_num1) {
  return new Promise(async (resolve, reject) => {
    try {
      await Set.destroy(
        {
          where: { set_num: set_num1 }
        });
      resolve();
    } catch (err) {
      reject(err.errors[0].message);
    }
    
  })
}



module.exports = { initialize, getAllSets, getSetByNum, getSetsByTheme, getAllThemes,addSet, editSet, deleteSet }



// sequelize
//   .sync()
//   .then( async () => {
//     try{
//       await Theme.bulkCreate(themeData);
//       await Set.bulkCreate(setData); 
//       console.log("-----");
//       console.log("data inserted successfully");
//     }catch(err){
//       console.log("-----");
//       console.log(err.message);

//       // NOTE: If you receive the error:

//       // insert or update on table "Sets" violates foreign key constraint //"Sets_theme_id_fkey"

//       // it is because you have a "set" in your collection that has a "theme_id" that //does not exist in the "themeData".   

//       // To fix this, use PgAdmin to delete the newly created "Themes" and "Sets" tables, //fix the error in your .json files and re-run this code
//     }

//     process.exit();
//   })
//   .catch((err) => {
//     console.log('Unable to connect to the database:', err);
//   });




