const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');


const app = express();
const PORT = 8000;


app.use(express.static(path.resolve(__dirname, '..', 'client')));


app.listen(PORT, function(){
    console.log("We started on PORT: ", PORT);
});