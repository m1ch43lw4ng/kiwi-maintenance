import React, { Component } from 'react';
import { Slot } from 'react-page-layout';

class PublicLayout extends Component {
    render() {
        return (
            <div>
                <header>Page Header</header>
                <Slot name="main" />
                <footer>Page Footer</footer>
            </div>
        );
    }
}

export default PublicLayout;
