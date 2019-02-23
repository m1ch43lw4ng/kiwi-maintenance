import React, { Component } from 'react';

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

    onSort(event, sortKey){
        const records = this.state.records;
        records.sort((a,b) => a[1][sortKey].localeCompare(b[1][sortKey]))
        this.setState({records})
    }

    render() {
        return (
            <table id="kiwibots" className="table table-bordered dataTable table-hover" role="grid">
                <thead class="thead-dark">
                    <tr role="row">
                        <th onClick={e => this.onSort(e, 'KiwibotID')}> Kiwibot ID </th>
                        <th onClick={e => this.onSort(e, 'Status')}> Status </th>
                        <th onClick={e => this.onSort(e, 'Symtoms/Diagnostic')}> Symptoms/Diagnostic </th>
                        <th onClick={e => this.onSort(e, 'Accountable')}> Accountable </th>
                        <th onClick={e => this.onSort(e, 'Last Updated')}> Last Updated </th>
                        <th onClick={e => this.onSort(e, 'Problem')}> Problems </th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.records.map(record => <BotRow {...record} />)}
                </tbody>
            </table>
        );
    }
}

export default Chart;

const BotRow = ({id, fields, createdTime}) => (
    <tr role="row">
        <th scope ="row">{fields["KiwibotID"]}</th>
        <td>{fields["Status"]}</td>
        <td>{fields["Symtoms/Diagnostic"]}</td>
        <td>{fields["Accountable"]}</td>
        <td>{fields["Last Updated"]}</td>
        <td>{fields["Problem"]}</td>
    </tr>
);