import React, { Component } from 'react';
import { Page, Section } from 'react-page-layout';

class LoginPage extends Component {
    render() {
        return (
            <Page layout="public">
                <Section slot="main">
                    <h1> THIS IS THE PAGE CONTENT </h1>
                </Section>
            </Page>
        );
    }
}

export default LoginPage;
