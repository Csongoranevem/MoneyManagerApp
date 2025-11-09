const express = require('express');
const router = express.Router();
const {query} = require('../utils/database');
var SHA1 = require("crypto-js/sha1");
const passwdRegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

//userek lehívása
router.get("/", (req, res)=>{
    
    query(`SELECT * FROM users` ,[], (error, results) =>{
        if(error) return res.status(500).json({errno: error.errno, msg: "Hiba történt :("}) ;
      
        res.status(200).json(results)
    },req);
})

//user lehívása id-vel
router.get("/:id", (req, res)=>{
    let id = req.params.id;
    query(`SELECT * FROM users WHERE id=?` ,[id], (error, results) =>{
        if(error) return res.status(500).json({errno: error.errno, msg: "Hiba történt :("}) ;
      
        res.status(200).json(results)
    },req);
})

//új user insert(register)
router.post("/", (req, res)=>{
    
    const { name, password, email, status, role} = req.body;
    
    query(`SELECT * FROM users WHERE email = ?`, [email], (error, results) => {
    if (error) {
      return res.status(500).json({ errno: error.errno, msg: "Database error" });
    }

    if (results.length > 0) {
      return res.status(400).json({ msg: "Email already exists" });
    }

      query(
        `INSERT INTO users(name, password, email, status, role) VALUES (?, ?, ?, ?, ?)`,
        [name, SHA1(password).toString(), email, status, role],
        (insertError, insertResults) => {
          if (insertError) {
            return res.status(500).json({ errno: insertError.errno, msg: "Insert failed" });
          }

          res.status(200).json(insertResults);
        },
        req
      );
  }, req);
})
//login user
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  query(
    `SELECT * FROM users WHERE email = ? AND password = ?`,[email, SHA1(password).toString()],(error, results) => {
      if (error) return res.status(500).json({ errno: error.errno, msg: "Hiba történt :(" });
      if (results.length === 0) {
        return res.status(400).json({ msg: "Hibás email vagy jelszó!" });
      }
      res.status(200).json(results[0]); 
    },
    req);
})


//user update id alapján
router.patch("/:id", (req, res)=>{
    let ID = req.params.id 
    const { name, password, email, status, role} = req.body;
    query(`UPDATE users SET name=?,password=?,email=?,status=?,role=? WHERE ID =?` ,[ name, password, email, status, role, ID], (error, results) =>{
        if(error) return res.status(400).json({errno: error.errno, msg: "Hiba történt :("}) ;
      
        res.status(200).json(results)
    },req);
})
//user jelszó frissítése id alapján
router.patch("/password/:id", (req, res) => {
  const ID = req.params.id;
  const { oldpass, password } = req.body;
  if (!oldpass || !password) {
    return res.status(400).json({ msg: "Hiányzik a jelszó vagy az ID!" });
  }
  if (oldpass === password) {
    return res.status(400).json({ msg: "A két jelszó nem lehet ugyanaz!" });
  }
  query(
    `SELECT * FROM users WHERE ID = ? AND password = ?`,
    [ID, SHA1(oldpass).toString()],
    (error, results) => {
      if (error) {
        return res.status(400).json({ msg: "Hiba történt az ellenőrzés során!", error });
      }
      if (results.length === 0) {
        return res.status(400).json({ msg: "Hibás régi jelszó!" });
      }
      query(
        `UPDATE users SET password = ? WHERE ID = ?`,
        [SHA1(password).toString(), ID],
        (error2) => {
          if (error2) {
            return res.status(400).json({ msg: "Nem sikerült frissíteni a jelszót!", error2 });
          }
          query(`SELECT * FROM users WHERE id=?` ,[ID], (error, results) =>{
            if(error) return res.status(400).json({errno: error.errno, msg: "Hiba történt :("}) ;
            
            res.status(200).json(results[0]); 
          },req);
          
        }
      );
    }
  );
});

//user név,email frissítése id alapján
router.patch("/profile/:id", (req, res)=>{
    let ID = req.params.id 
    const { name,email} = req.body;
    query(`UPDATE users SET name=?,email=? WHERE ID =?` ,[ name, email,ID], (error, results) =>{
        if(error) return res.status(500).json({errno: error.errno, msg: "Hiba történt :("}) ;
        if(error) return res.status(400).json({errno: error.errno, msg: "Hiba történt :("}) ;

         query(`SELECT * FROM users WHERE id=?` ,[ID], (error, results) =>{
          if(error) return res.status(400).json({errno: error.errno, msg: "Hiba történt :("}) ;
          
          res.status(200).json(results[0]); 
        },req);
        
    },req);
})

//user törlése id alapján
router.delete("/:id", (req, res)=>{
    let id = req.params.id;
    query(`DELETE FROM users WHERE id=?` ,[id], (error, results) =>{
        if(error) return res.status(500).json({errno: error.errno, msg: "Hiba történt :("}) ;
      
        res.status(200).json(results)
    },req);
})


module.exports = router;