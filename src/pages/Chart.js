import React, { Component } from 'react';
import SplitPane from 'react-split-pane';
import Iframe from 'react-iframe'
import '../index.css';
import Airtable from 'airtable';
import config from './config.js';

const base = new Airtable({ apiKey: config.get('apiKey')}).base(config.get('baseId'));
const linkUrl = "https://airtable.com/embed/"+ config.get('url')+ "?backgroundColor=purple";

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
                    fetchNextPage();
                }
            );
        base('REGXNOVEDADES').select({view: 'Grid view'})
            .eachPage(
                (records, fetchNextPage) => {
                    this.setState({
                        updates: records
                    });
                    fetchNextPage();
                }
            );
    }

    render() {
        console.log(this.state.updates);
        return (
            <SplitPane split="vertical" minSize={500} maxSize={1200} defaultSize={1000} allowResize={true}>
                <div className="table-wrapper">
                    <table className="table table-bordered table-hover table-responsive">
                        <thead>
                            <tr className="thead-dark">
                                <th scope="col">Kiwibot ID</th>
                                <th scope="col">Status</th>
                                <th scope="col">Symptoms/Diagnostic</th>
                                <th scope="col">Accountable</th>
                                <th scope="col">Last Updated</th>
                                <th scope="col">Problems</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.botxreg.map(record => <RowData{...record} />)}
                        </tbody>
                    </table>
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

const RowData = ({id, fields, createdTime}) => (
    <tr>
        <th scope ="row">{fields["KiwibotID"]}</th>
        <td>{fields["Status"]}</td>
        <td>{fields["Symtoms/Diagnostic"]}</td>
        <td>{fields["Accountable"]}</td>
        <td>{fields["Last Updated"]}</td>
        <td>{fields["Problem"]}</td>
    </tr>
);
