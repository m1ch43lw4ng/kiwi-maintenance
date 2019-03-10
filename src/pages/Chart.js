import React, { Component } from 'react';
import SplitPane from 'react-split-pane';
import Iframe from 'react-iframe'
import '../index.css';
import Airtable from 'airtable';
import config from '../config.js';
import Refresh from './Refresh.js';
import BootstrapTable from 'react-bootstrap-table-next';

const base = new Airtable({ apiKey: config.get('apiKey')}).base(config.get('baseId'));
const linkUrl = "https://airtable.com/embed/"+ config.get('url')+ "?backgroundColor=purple";

const columns = [{
    dataField: 'KiwibotID',
    text: 'Kiwibot ID',
    sort: true
}, {
    dataField: 'Status',
    text: 'Status',
    sort: true
}, {
    dataField: 'Symtoms/Diagnostic',
    text: 'Symptoms/Diagnostic',
    sort: true
}, {
    dataField: 'Accountable',
    text: 'Accountable',
    sort: true
}, {
    dataField: 'Last Updated',
    text: 'Last Updated',
    sort: true
}, {
    dataField: 'Problem',
    text: 'Problems',
    sort: true
}];

const defaultSorted = [{
    dataField: 'name',
    order: 'desc'
}];

class Chart extends Component {

    constructor(props) {
        super(props);
        this.state = {
            botxreg: [],
            updates: []
        };
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
    }

    render() {
        console.log(this.state.botxreg);
        console.log(this.state.botxreg.map(record => RowData(record)));
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