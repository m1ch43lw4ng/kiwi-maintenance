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
        this.setState({
            newUpdates: []
        })
        base('REGXNOVEDADES').select({
            view: 'Grid view',
            filterByFormula: 'REGID >= ' + this.state.maxRegID
        }).eachPage(
            (records, fetchNextPage) => {
                records.forEach((record) => {
                    this.state.newUpdates.push(record);
                });
                this.setState({
                    maxRegID: records[records.length - 1]["fields"]["REGID"]
                });
                fetchNextPage();
            }
        );

        console.log(this.state.maxRegID);
        console.log(this.state.newUpdates);

        let oldRecords = [];
        this.state.newUpdates.forEach((newRecord) => {
            let id = newRecord["fields"]["KiwibotID"];
            base('BOTXREG1').select({
                view: 'Grid view',
                filterByFormula: 'KiwibotID = ' + id
            }).eachPage(
                (records, fetchNextPage) => {
                records.forEach(function(record) {
                    oldRecords.push(record);
                });
                fetchNextPage();
            });
        });

        this.state.newUpdates.forEach((newRecord) => {
            let id = newRecord["fields"]["KiwibotID"];
            base('BOTXREG1').select({
                view: 'Grid view',
                filterByFormula: 'KiwibotID =' + id
            }).eachPage(
                (records, fetchNextPage) => {
                    records.forEach(function(record) {
                        oldRecords.push(record);
                        fetchNextPage();
                        base('BOTXREG1').update({record}, {newRecord}, function(err, record) {
                            if (err) { console.error(err); return; }
                            console.log(record.get('id'));
                        });
                        base('BOTXREG1').update('recCEyKaYnJW6VwN1', {
                            "REGID": 134,
                            "Status": [
                                "In Queue"
                            ],
                            "Symtoms/Diagnostic": "door not opening",
                            "Last Updated": "2019-02-11T23:03:00.000Z",
                            "Accountable": "Ricardo Rambal",
                            "KiwibotID": 208,
                            "Active Trigger": 0
                        }
                    });
                });
        });
        console.log(oldRecords);
        console.log(this.state.maxRegID);
    }

    componentDidMount() {
        base('REGXNOVEDADES').select({
            view: 'Grid view',
            filterByFormula: 'REGID > 197'
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
