const express = require("express")
const app = express();
const methodOverride = require("method-override");
const port = 8080;

const path = require("path");

app.set("view engine","ejs");

app.use(methodOverride("_method"))
app.use(express.urlencoded({ extended: true}));

app.set("views",path.join(__dirname,"/views"));
app.use("/css", express.static(path.join(__dirname, "/path/css")));



const { faker } = require('@faker-js/faker');
const mysql = require("mysql2");


const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "rohit_app",
  password: "rohit1234singh"
});

// let getRandomUser = ()=> {
//   return [
//     faker.string.uuid(),
//     faker.internet.userName(),
//     faker.internet.email(),
//     faker.internet.password(),
//   ];
// };

//Inserting new data
// let q = "INSERT INTO user (id, username, email, password) VALUES ?";
// let data = [];
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

//Edit route
app.get("/user/:id/edit",(req,res)=>{
  let { id } = req.params;
  let q = `SELECT * FROM user WHERE id = "${id}"`;

  try{
    connection.query(q,(err, result)=>{
      if(err)
        throw err;
      let user = result[0];
      res.render("edit.ejs",{ user });
    })
  }catch(err){
    console.log(err);
    res.send("Some error occured at edit route");
  }
  
})

//Update Route
app.patch("/user/:id",(req,res)=>{
  let { id } = req.params;
  let { password: formPass, username: newUsername} = req.body;
  let q = `SELECT * FROM user WHERE id = "${id}"`;
  try{
    connection.query(q,(err,result)=>{
      if(err) throw err;
      let user = result[0];
      if(formPass != user.password){
        res.send("Password incorrect!");
      }else{
        let q2 = `UPDATE user SET username='${newUsername}' WHERE id = '${id}'`
        connection.query(q2,(err,result)=>{
          if(err) throw err;
          res.redirect("/user");
        })
      }
    })
  }catch(err){
    console.log(err);
    res.send("some error occured in the update route");
  }
});

//create new User
app.get("/user/newUser",(req,res)=>{
  res.render("newUser.ejs");
});

app.post("/user/newUser",(req,res)=>{
  let { id, username, email, password} = req.body;
  let q = "INSERT INTO user (id, username, email, password) VALUES (?,?,?,?)";
  try{
    connection.query(q, [id, username, email, password],(err,result)=>{
      if(err) throw err;
      res.redirect("/user");
    });
  }catch(err){
    console.log("some error");
    res.send("Some error occured at the post route of user");
  }
});

//DELETE route

app.delete("/user/:id/delete",(req,res)=>{
  let { id } = req.params;
  let q = `DELETE FROM user WHERE id = "${id}"`;
  try{
    connection.query(q,(err,result)=>{
    if(err) throw err;
    res.redirect("/user");
    })
  }catch(err){
    console.log(err);
    res.send("Error in the delete route")
  }
})

//edit route
// app.get("/user/:id/edit",(req,res)=>{
//   let { id } = req.params;
//   let q = `Select * FROM user WHERE id = ${id}`
//   try{
//     connection.query(q, (err,update)=>{
//       if(err)
//         throw err;
//       res.render("edit.ejs", { update })
//     });
//   }catch(err){
//     console.log(err);
//     res.send("Some error occured while displaying info of the user")
//   }
// })


app.listen(port,()=>{
  console.log(`App is listening to port: ${port}`);
});



