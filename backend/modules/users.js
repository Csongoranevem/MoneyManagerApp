const express = require('express');
const router = express.Router();
const {query} = require('../utils/database');

router.get("/", (req, res)=>{
    
    query(`SELECT * FROM users` ,[], (error, results) =>{
        if(error) return res.status(500).json({errno: error.errno, msg: "Hiba történt :("}) ;
      
        res.status(200).json(results)
    },req);
})

module.exports = router;