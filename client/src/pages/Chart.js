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
import {
    // eslint-disable-next-line
    BrowserView,
    // eslint-disable-next-line
    MobileView,
    // eslint-disable-next-line
    isBrowser,
    isMobile
} from "react-device-detect";

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
    },
    classes: function callback(cell, row, rowIndex, colIndex)
    {
        "border-box truncate pill px1 cellToken choiceToken line-height-4 fit mr-half flex-none redBright print-color-exact text-white"
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
    state = {
        response: '',
        post: '',
        responseToPost: '',
    };
    componentDidMount() {
        this.callApi()
            .then(res => this.setState({ response: res.express }))
            .catch(err => console.log(err));
    }
    callApi = async () => {
        const response = await fetch('/api/hello');
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        return body;
    };
    handleSubmit = async e => {
        e.preventDefault();
        const response = await fetch('/api/world', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ post: this.state.post }),
        });
        const body = await response.text();
        this.setState({ responseToPost: body });
    };
    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <p>
                        Edit <code>src/App.js</code> and save to reload.
                    </p>
                    <a
                        className="App-link"
                        href="https://reactjs.org"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Learn React
                    </a>
                </header>
                <p>{this.state.response}</p>
                <form onSubmit={this.handleSubmit}>
                    <p>
                        <strong>Post to Server:</strong>
                    </p>
                    <input
                        type="text"
                        value={this.state.post}
                        onChange={e => this.setState({ post: e.target.value })}
                    />
                    <button type="submit">Submit</button>
                </form>
                <p>{this.state.responseToPost}</p>
            </div>
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

