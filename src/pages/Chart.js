import React, { Component } from 'react';
import SplitPane from 'react-split-pane';
import Iframe from 'react-iframe'
import '../index.css';
import Airtable from 'airtable';
import config from '../config.js';
import BootstrapTable from 'react-bootstrap-table-next';

const base = new Airtable({ apiKey: config.get('apiKey')}).base(config.get('baseId'));
const linkUrl = "https://airtable.com/embed/"+ config.get('url')+ "?backgroundColor=purple";

const columns = [{
    dataField: 'KiwibotID',
    text: 'Kiwibot ID',
    sort: true,
    headerStyle: {
        backgroundColor: '#3bb4e5'
    }
}, {
    dataField: 'Status',
    text: 'Status',
    sort: true,
    headerStyle: {
        backgroundColor: '#3bb4e5'
    }
}, {
    dataField: 'Symtoms/Diagnostic',
    text: 'Symptoms/Diagnostic',
    sort: true,
    headerStyle: {
        backgroundColor: '#3bb4e5'
    }
}, {
    dataField: 'Accountable',
    text: 'Accountable',
    sort: true,
    headerStyle: {
        backgroundColor: '#3bb4e5'
    }
}, {
    dataField: 'Last Updated',
    text: 'Last Updated',
    sort: true,
    headerStyle: {
        backgroundColor: '#3bb4e5'
    }
}, {
    dataField: 'Problem',
    text: 'Problems',
    headerStyle: {
        backgroundColor: '#3bb4e5'
    }
}];

const defaultSorted = [{
    dataField: 'KiwibotID',
    order: 'asc'
}];

class Chart extends Component {

    constructor(props) {
        super(props);
        this.state = {
            botxreg: [],
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
                            "PROBLEMS": newRecord["fields"]["Problem"],
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

        /**
         * Regenerates the table
         * */
        base('BOTXREG1').select({view: 'Grid view'})
            .eachPage(
                (records, fetchNextPage) => {
                    this.setState({
                        botxreg: records
                    });
                }
            );
        this.render();
    }

    componentDidMount() {
        base('BOTXREG1').select({view: 'Grid view'})
            .eachPage(
                (records, fetchNextPage) => {
                    this.setState({
                        botxreg: records
                    });
                }
            );

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
            <SplitPane split="vertical" minSize={500} maxSize={1200} defaultSize={1000} allowResize={true}>
                <div className="table-wrapper">
                    <BootstrapTable
                        bootstrap4
                        keyField="KiwibotID"
                        data={ this.state.botxreg.map(record => RowData(record)) }
                        columns={ columns }
                        defaultSorted={ defaultSorted }
                    />
                </div>
                <div className="overlay">
                    <Iframe url= {linkUrl}
                            width="100%"
                            height="800"
                            id="myId"
                            className="airtable-embed"
                            display="initial"
                            position="relative"
                            allowFullScreen/>
                </div>
            </SplitPane>
        );
    }
}


export default Chart;

const RowData = ({id, fields}) => (
    {
        'KiwibotID': fields['KiwibotID'],
        'Status': fields['Status'],
        'Symtoms/Diagnostic': fields['Symtoms/Diagnostic'],
        'Accountable': fields['Accountable'],
        'Last Updated': fields['Last Updated'],
        'Problem': fields['Problem']
    }
);