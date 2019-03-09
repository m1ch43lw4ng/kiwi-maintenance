import React, { Component } from 'react';
import Airtable from 'airtable';
import config from '../config.js';

const base = new Airtable({ apiKey: config.get('apiKey')}).base(config.get('baseId'));

class Refresh extends Component {
    constructor(props) {
        super(props);
        this.state = {
            maxRegID: 0,
            newUpdates: []
        };
    }

    refresh() {
        /**
         * Iterates through the old records that will be replaced by the updates added during
         * the previous refresh, and updates all of them to match the new updates (regxnovedades).
         * */
        let oldRecords = [];
        this.state.newUpdates.forEach((newRecord) => {
            let botid = newRecord["fields"]["KiwibotID"];
            console.log(botid);
            base('BOTXREG1').select({
                view: 'Grid view',
                filterByFormula: 'KiwibotID = ' + botid
            }).eachPage(
                (records, fetchNextPage) => {
                    records.forEach(function(record) {
                        oldRecords.push(record);

                        /**
                         * The updating step
                         * */
                        base('BOTXREG1').update(record["id"], {
                            "KiwibotID": newRecord["fields"]["KiwibotID"],
                            "Status": newRecord["fields"]["Status"],
                            "Symtoms/Diagnostic": newRecord["fields"]["Symtoms/Diagnostic"],
                            "Last Updated": newRecord["fields"]["Last Updated"],
                            "Accountable": newRecord["fields"]["Accountable"],
                            "Active Trigger": newRecord["fields"]["ActiveTrigger"]
                        }, function(err, record) {
                            if (err) { console.error(err); return; }
                            console.log(record.get('id'));
                        });
                    });
                    fetchNextPage();
                });
        });

        console.log(this.state.newUpdates);
        console.log(oldRecords);
        console.log(this.state.maxRegID);

        /**
         * Sets the next iteration of newUpdates and maxRegID (state will update by next refresh)
         * */
        this.setState({
            newUpdates: []
        });

        base('REGXNOVEDADES').select({
            view: 'General',
            filterByFormula: 'REGID >= ' + this.state.maxRegID
        }).eachPage(
            (records, fetchNextPage) => {
                records.forEach((record) => {
                    this.state.newUpdates.push(record);
                    this.setState({
                        maxRegID: record["fields"]["REGID"]
                    });
                });
                fetchNextPage();
            }
        );
    }

    componentDidMount() {
        base('REGXNOVEDADES').select({
            view: 'General',
            filterByFormula: 'REGID > 240'
        }).eachPage(
            (records, fetchNextPage) => {
                console.log(records);
                this.setState({
                    maxRegID: records[records.length - 1]["fields"]["REGID"]
                });
                fetchNextPage();
            }
        );
        console.log(this.state.maxRegID);

        /** Initializes an interval counter to refresh every timeout milliseconds*/
        setInterval(() => this.refresh(), 10000);
    }

    render() {
        return (
            <div>
            </div>
        );
    }
}


export default Refresh;
