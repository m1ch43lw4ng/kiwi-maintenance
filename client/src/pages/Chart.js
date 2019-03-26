import React, { Component } from 'react';
import SplitPane from 'react-split-pane';
import Iframe from 'react-iframe'
import '../index.css';
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

class Chart extends Component {

    constructor(props) {
        super(props);
        this.state = {
            botxreg: [],
        };
    }

    componentDidMount() {
        setInterval(() => this.refresh(), 5000);
    }

    refresh() {
        this.callApi()
            .then(res => this.setState({ botxreg: res.express }))
            .catch(err => console.log(err));
    }

    callApi = async () => {
        const response = await fetch('/api/get');
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        return body;
    };

    render() {
        if (isMobile) {
            return (
                <Iframe url="https://airtable.com/shryz6KcYKk2rdU1u"
                        width="100%"
                        height="800"
                        id="myId"
                        className="airtable-embed"
                        display="initial"
                        position="relative"
                        allowFullScreen/>
            )
        } else {
            return (
                <SplitPane split="vertical" minSize={800} maxSize={1200} defaultSize={1000} allowResize={true}>
                    <div className="table-wrapper">
                        <Iframe url="https://airtable.com/embed/shranXlgJpGsbzbrm?backgroundColor=purple&viewControls=on"
                                width="100%"
                                height="1200"
                                id="form"
                                className="airtable-embed"
                                display="initial"
                                position="relative"
                                allowFullScreen/>
                    </div>
                    <div className="overlay">
                        <Iframe url="https://airtable.com/embed/shryz6KcYKk2rdU1u?backgroundColor=purple"
                                width="100%"
                                height="1200"
                                id="form"
                                className="airtable-embed"
                                display="initial"
                                position="relative"
                                allowFullScreen/>
                    </div>
                </SplitPane>
            );
        }
    }
}

export default Chart;
