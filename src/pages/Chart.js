import React, { Component } from 'react';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';

let order = "desc"
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

    handleBtnClick = () => {
        if (order === 'desc') {
            this.refs.table.handleSort('asc', 'name');
            order = 'asc';
        } else {
            this.refs.table.handleSort('desc', 'name');
            order = 'desc';
        }
    }

    render() {
        console.log(this.state.records);
        return (
            <div>
                <BootstrapTable ref='table' data={ this.state.records.map(record => recordfields) }>
                    <TableHeaderColumn dataField='id' isKey={ true } dataSort={ true }>Kiwibot ID</TableHeaderColumn>
                    <TableHeaderColumn dataField='status' dataSort={ true }>Status</TableHeaderColumn>
                    <TableHeaderColumn dataField='symptoms' dataSort={ true }>Symptoms/Diagnostic</TableHeaderColumn>
                    <TableHeaderColumn dataField='accountable' dataSort={ true }>Accountable</TableHeaderColumn>
                    <TableHeaderColumn dataField='updated' dataSort={ true }>Last Updated</TableHeaderColumn>
                    <TableHeaderColumn dataField='problem' dataSort={ true }>Problem</TableHeaderColumn>
                </BootstrapTable>
            </div>
        );
    }
}

export default Chart;

const RowData = ({id, fields}) => (
    fields
);