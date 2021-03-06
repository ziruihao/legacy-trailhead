// const express = require('express');
import express from 'express';
// const path = require('path');
import path from 'path';
import sslRedirect from 'heroku-ssl-redirect';

const app = express();

app.use(sslRedirect());

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, 'dist')));

// An api endpoint that returns a short list of items
app.get('/api/getList', (req,res) => {
	var list = ["item1", "item2", "item3"];
	res.json(list);
	console.log('Sent list of items');
});

// Handles any requests that don't match the ones above
app.get('*', (req, res) =>{
	res.sendFile(path.join(__dirname, 'dist/index.html'));
});

const port = process.env.PORT || 8080;
app.listen(port);

console.log('App is listening on port ' + port);