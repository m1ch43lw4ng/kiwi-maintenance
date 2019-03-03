import React, { Component } from 'react';
import { render } from 'react-dom';
import { LayoutProvider } from 'react-page-layout';
import PublicLayout from './layouts/PublicLayout.js';
import Chart from './pages/Chart.js';
import Refresh from './pages/Refresh.js';

const layouts = {
    'public': PublicLayout,
};

class App extends Component {
    function
    render() {
        return (
            <LayoutProvider layouts={layouts}>
                <Refresh/>
            </LayoutProvider>
        );
    }
}
render(App, document.getElementById('root'));

export default App;
