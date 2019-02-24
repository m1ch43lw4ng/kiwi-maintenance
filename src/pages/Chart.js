import React, { Component } from 'react';
import {render} from "react-dom";

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
        return (
            <table class="table table-bordered table-hover table-responsive">
                <thead>
                <tr class="thead-dark">
                    <th scope="col">Kiwibot ID</th>
                    <th scope="col">Status</th>
                    <th scope="col">Symptoms/Diagnostic</th>
                    <th scope="col">Accountable</th>
                    <th scope="col">Last Updated</th>
                    <th scope="col">Problems</th>
                </tr>
                </thead>
                <tbody>
                    {this.state.records.map(record => <RowData{...record} /> )}
                </tbody>
            </table>
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