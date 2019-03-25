import Airtable from 'airtable';
import config from '../config.js';

const express = require('express');
const app = express();
const PORT = 3000;

app.get('/', function(req, res) {
    res.status(200).send('Hello world');
});

app.listen(PORT, function() {
    console.log('Server is running on PORT:',PORT);
});

const base = new Airtable({ apiKey: config.get('apiKey')}).base(config.get('baseID'));
const linkUrl = "https://airtable.com/embed/"+ config.get('url')+ "?backgroundColor=purple";


