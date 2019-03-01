import React, { Component } from 'react';
import SplitPane from 'react-split-pane';
import Iframe from 'react-iframe'
import '../index.css';

class Chart extends Component {

    constructor(props) {
        super(props);
        this.state = {
            records: []
        };
    }

    componentDidMount() {
        fetch('https://api.airtable.com/v0/appftVAUOeQ3VtUxf/BOTXREG1?api_key=key6X8BebBRSfUqvE')
            .then((resp) => resp.json())
            .then(data => {
                this.setState({ records: data.records });
            }).catch(err => {
        });
    }

    render() {
        console.log(this.state.records);
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
                            {this.state.records.map(record => <RowData{...record} />)}
                        </tbody>
                    </table>
                </div>
                <div className="overlay">
                    <Iframe url="https://airtable.com/embed/shryz6KcYKk2rdU1u?backgroundColor=purple"
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
