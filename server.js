const Airtable = require('airtable');
const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

console.log(process.env.PORT);
const base = new Airtable({ apiKey: process.env.API_KEY}).base(process.env.BASE_ID);

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api/get', (req, res) => {
    res.send(regenTable());
});

app.post('/api/post', (req, res) => {
    console.log(req.body);
    res.send(
        `I received your POST request. This is what you sent me: ${req.body.post}`,
    );
});

if (process.env.NODE_ENV === 'production') {
    // Serve any static files
    app.use(express.static(path.join(__dirname, 'client/build')));
    // Handle React routing, return all requests to React app
    app.get('*', function(req, res) {
        res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
    });
}

app.listen(port, () => console.log(`Listening on port ${port}`));

/** Tracking variables */
let maxRegID = 0;
let newUpdates = [];

/**
 * Iterates through the old records that will be replaced by the updates added during
 * the previous refresh, and updates all of them to match the new updates (regxnovedades).
 * */
function crossUpdate() {
    /**
     * Uses previous newUpdates to update the table
     * */
    newUpdates.forEach((newRecord) => {
        let botID = newRecord["fields"]["KiwibotID"];
        base('BOTXREG1').select({
            view: 'Grid view',
            filterByFormula: 'KiwibotID = ' + botID
        }).eachPage(
            (records, fetchNextPage) => {
                records.forEach(function(record) {
                    /**
                     * The updating step
                     * */
                    base('BOTXREG1').update(record["id"], {
                        "KiwibotID": newRecord["fields"]["KiwibotID"],
                        "Status": newRecord["fields"]["Status"],
                        "Symtoms/Diagnostic": newRecord["fields"]["Symtoms/Diagnostic"],
                        "Last Updated": newRecord["fields"]["Last Updated"],
                        "Accountable": newRecord["fields"]["Accountable"],
                        "PROBLEMS": newRecord["fields"]["Problem"],
                        "Active Trigger": newRecord["fields"]["ActiveTrigger"]
                    }, function(err) {
                        if (err) { console.error(err); return; }
                    });
                });
                fetchNextPage();
            });
    });

    /**
     * Sets the next iteration of newUpdates and maxRegID
     * */
    newUpdates = [];
    base('REGXNOVEDADES').select({
        view: 'General',
        filterByFormula: 'REGID >= ' + maxRegID
    }).eachPage(
        (records, fetchNextPage) => {
            records.forEach((record) => {
                newUpdates.push(record);
                maxRegID = record["fields"]["REGID"]
            });
            fetchNextPage();
        }
    );
}

/**
 * Regenerates the table
 * */
function regenTable() {
    let botxreg = [];
    base('BOTXREG1').select({view: 'Grid view'})
        .eachPage(
            (records, fetchNextPage) => {
                records.forEach((record) => {
                    botxreg.push(record)
                });
                fetchNextPage();
            }
        );
    return botxreg;
}

base('REGXNOVEDADES').select({
    view: 'General',
    filterByFormula: 'REGID > 440'
}).eachPage(
    (records, fetchNextPage) =>  {
        records.forEach((record) => {
            newUpdates.push(record);
            maxRegID = record["fields"]["REGID"]
        });
        fetchNextPage();
    }
);

setInterval(() => crossUpdate(), 5000);
