import React, { Component } from 'react';
import SplitPane from 'react-split-pane';
import Iframe from 'react-iframe'
import '../index.css';
import Airtable from 'airtable';
import config from '../config.js';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import moment from "moment-timezone";

const base = new Airtable({ apiKey: config.get('apiKey')}).base(config.get('baseId'));
const linkUrl = "https://airtable.com/embed/"+ config.get('url')+ "?backgroundColor=purple";

const { SearchBar, ClearSearchButton } = Search;

const columns = [{
    dataField: 'KiwibotID',
    text: 'Bot #',
    sort: true,
    headerStyle: (colum, colIndex) => {
        return { width: '90px', textAlign: 'center' };
    }
}, {
    dataField: 'Status',
    text: 'Status',
    sort: true,
    headerStyle: (colum, colIndex) => {
        return { width: '110px', textAlign: 'center' };
    }
}, {
    dataField: 'Symtoms/Diagnostic',
    text: 'Diagnostic',
    sort: true,
}, {
    dataField: 'Accountable',
    text: 'Accountable',
    sort: true,
    headerStyle: (colum, colIndex) => {
        return { width: '150px', textAlign: 'center' };
    }
}, {
    dataField: 'Last Updated',
    text: 'Last Updated',
    sort: true,
    headerStyle: (colum, colIndex) => {
        return { width: '190px', textAlign: 'center' };
    }
}, {
    dataField: 'Problem',
    text: 'Problems',
    headerStyle: (colum, colIndex) => {
        return { width: '110px', textAlign: 'center' };
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
            let botID = newRecord["fields"]["KiwibotID"];
            base('BOTXREG1').select({
                view: 'Grid view',
                filterByFormula: 'KiwibotID = ' + botID
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
                        }, function(err) {
                            if (err) { console.error(err); return; }
                        });
                    });
                    fetchNextPage();
                });
        });

        /**
         * Sets the next iteration of newUpdates and maxRegID (state will update by next refresh)
         * */
        this.setState({
            newUpdates: [],
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
         * Regenerates the table : ONLY WORKS FOR <= 100 ROBOTS
         * */
        base('BOTXREG1').select({view: 'Grid view'})
            .eachPage(
                (records) => {
                    this.setState ({
                        botxreg: records
                    });
                }
            );
    }

    componentWillMount() {
        /**
         * Current code only works for each airtable "page" (100 elements)
         *
         * For more, would have to use:
         *
         .eachPage(
             (records, fetchNextPage) => {
                 records.forEach((record) => {
                    this.state.botxreg.push(record)
                 });
                 fetchNextPage();
             }
         );
         *
         * */
        base('BOTXREG1').select({view: 'Grid view'})
            .eachPage(
                (records) => {
                    this.setState({
                        botxreg: records
                    });
                }
            );

        base('REGXNOVEDADES').select({
            view: 'General',
            filterByFormula: 'REGID > 340'
        }).eachPage(
            (records, fetchNextPage) => {
                this.setState({
                    maxRegID: records[records.length - 1]["fields"]["REGID"]
                });
                fetchNextPage();
            }
        );
        console.log(this.state.maxRegID);
    }

    componentDidMount() {
        /** Initializes an interval counter to refresh every timeout milliseconds*/
        setInterval(() => this.refresh(), 5000);
    }

    render() {
        return (
            <SplitPane split="vertical" minSize={800} maxSize={1200} defaultSize={1000} allowResize={true}>
                <div className="table-wrapper">
                    <ToolkitProvider
                        boostrap4
                        hover
                        bordered
                        search
                        keyField="id"
                        data={ this.state.botxreg.map(record => RowData(record)) }
                        columns={ columns }
                        defaultSorted={ defaultSorted }
                    >
                        {
                            props => (
                                <div>
                                    <small>&nbsp;</small>
                                    <h2><strong>Kiwibot Maintenance Registry</strong></h2>
                                    <small>&nbsp;</small>

                                    <SearchBar { ...props.searchProps } />
                                    <ClearSearchButton { ...props.searchProps } />

                                    <hr />
                                    <BootstrapTable
                                        { ...props.baseProps }
                                    />
                                </div>
                            )
                        }
                    </ToolkitProvider>
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
        'Last Updated': DateConvert(fields['Last Updated']),
        'Problem': fields['Problem']
    }
);

/**
 * @return {string}
 */
function DateConvert(dateString) {
    let newDateString = moment.tz(dateString, "America/Los_Angeles").format();
    return newDateString.slice(0, 4) + "/"
        + newDateString.slice(5, 7) + "/"
        + newDateString.slice(8, 10) + "  "
        + TimeConvert(newDateString.slice(11, 16));
}

/**
 * @return {string}
 */
function TimeConvert(timeString) {
    const hh = timeString.slice(0, 2);
    const mm = timeString.slice(3, 5);
    let dd = "AM";
    let h = hh;
    if (h >= 12) {
        h = hh - 12;
        dd = "PM";
    }
    if (h === 0) {
        h = 12;
    }

    return h + ":" + mm + " " + dd;
}
