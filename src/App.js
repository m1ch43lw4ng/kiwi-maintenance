import React, { Component } from 'react';
import { render } from 'react-dom';
import { LayoutProvider } from 'react-page-layout';
import PublicLayout from './layouts/PublicLayout.js';
import LoginPage from './pages/LoginPage.js';
import Chart from './pages/Chart.js';


const layouts = {
    'public': PublicLayout,
};

class App extends Component {
    function

    render() {

        // Render your page inside
        // the layout provider
        return (
            <LayoutProvider layouts = {layouts}>
                <Chart />
            </LayoutProvider>
        );
    }
}

render(App, document.getElementById('root'));
export default App;
