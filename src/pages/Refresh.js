import React, { Component } from 'react';
import Airtable from 'airtable';
import config from '../config.js';

const base = new Airtable({ apiKey: config.get('apiKey')}).base(config.get('baseId'));

class Refresh extends Component {
    constructor(props) {
        super(props);
        this.state = {
            updates: [],
            num:0,
            list: [],
            prevNum: 0
        };
    }

    refresh() {
        this.setState(prevState => ({
            list: prevState.updates,
            prevNum: prevState.num,
            num: prevState.updates.length
        }));
        base('REGXNOVEDADES').select({view: 'Grid view'})
            .eachPage(
                (records, fetchNextPage) => {
                    this.setState({
                        updates: records
                    });
                    fetchNextPage();
                }
            );
        console.log(this.state.list);
        console.log(this.state.num);
        console.log(this.state.prevNum);

        for (var i = 0; i < (this.state.updates.length % 100) - (this.state.prevNum % 100); i++) {
            var newRecord = this.state.updates[this.state.updates.length - i - 1];
            console.log(newRecord);

            var oldRecord = base('BOTXREG1').find(newRecord["fields"]["KiwibotID"], function(err, record) {
                if (err) { console.error(err); return; }
                    console.log(record);
                });
            console.log(oldRecord);

            base('BOTXREG1').replace(oldRecord["fields"]["id"], {
                newRecord
            }, function(err, record) {
                if (err) { console.error(err); return; }
                console.log(record.get('id'));
            });
        }
    }

    componentDidMount() {
        this.setState ({
            updates: []
        });
        base('REGXNOVEDADES').select({view: 'Grid view'})
            .eachPage(
                (records, fetchNextPage) => {
                    this.setState({
                        updates: records
                    });
                    fetchNextPage();
                }
            );
        setInterval(() => this.refresh(), 10000);
    }

    render(){
        return (
            <div>
            </div>
        );
    }
}

export default Refresh