const Airtable = require('airtable');
const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();

console.log(process.env.PORT);
const base = new Airtable({ apiKey: process.env.API_KEY}).base(process.env.BASE_ID);

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.get('/api/hello', (req, res) => {
    res.send({ express: 'Hello From Express' });
});
app.post('/api/world', (req, res) => {
    console.log(req.body);
    res.send(
        `I received your POST request. This is what you sent me: ${req.body.post}`,
    );
});

app.listen(port, () => console.log(`Listening on port ${port}`));

/** Tracking variables */
let botxreg = [];
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
    botxreg = [];
    base('BOTXREG1').select({view: 'Grid view'})
        .eachPage(
            (records, fetchNextPage) => {
                records.forEach((record) => {
                    botxreg.push(record)
                });
                fetchNextPage();
            }
        );
}
function refresh() {
    crossUpdate();
    regenTable();
}

/**
 * Current code only works for each airtable "page" (100 elements)
 *
 * For more, would have to use:
 *
 .eachPage(
 (records, fetchNextPage) => {
                 records.forEach((record) => {
                    botxreg.push(record)
                 });
                 fetchNextPage();
             }
 );
 *
 * */
base('BOTXREG1').select({view: 'Grid view'})
    .eachPage(
        (records, fetchNextPage) => {
            records.forEach((record) => {
                botxreg.push(record)
            });
            fetchNextPage();
        }
    );

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

setInterval(() => refresh(), 5000);
