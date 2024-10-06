const express = require("express")
const app = express();

const port = 8080;

const path = require("path");

app.set("view engine","ejs");

app.set("views",path.join(__dirname,"/views"));

const { faker } = require('@faker-js/faker');
const mysql = require("mysql2");


const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "rohit_app",
  password: "rohit1234singh"
});

let getRandomUser = ()=> {
  return [
    faker.string.uuid(),
    faker.internet.userName(),
    faker.internet.email(),
    faker.internet.password(),
  ];
};

//Inserting new data
// let q = "INSERT INTO user (id, username, email, password) VALUES ?";
let data = [];
// for(let i =1; i<=100; i++){
//   data.push(getRandomUser());
// }

// try{
//   connection.query(q, [data], (err,result)=>{
//     if(err)
//       throw err;
//       console.log(result);
//   });
// }catch(err){
//   console.log(err);
// }

// connection.end();


//Total User Route
app.get("/",(req,res)=>{
  let q = `SELECT count(*) FROM user`;
  try{
  connection.query(q, (err,result)=>{
    if(err)
      throw err;
      let count = result[0]["count(*)"];
      res.render("home.ejs",{count});
  });
}catch(err){
    console.log(err);
    res.send("Some error occured in the count");
  }
});

//Information Route

app.get("/user",(req,res)=>{
  let q = `SELECT * FROM user`;
  try{
    connection.query(q, (err,users)=>{
      if(err)
        throw err;
        res.render("show.ejs", { users });
    });
  }catch(err){
      console.log(err);
      res.send("Some error in DB");
    }
});


app.listen(port,()=>{
  console.log(`App is listening to port: ${port}`);
});



