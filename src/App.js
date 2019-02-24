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

<<<<<<< HEAD
        // Render your page inside
        // the layout provider
        return (
            <LayoutProvider layouts = {layouts}>
                <Chart />
            </LayoutProvider>
        );
    }
=======
  render() {
      console.log(this.state.records)
    return (
      <table class="table">
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
          {this.state.records.map(record => <BotRow {...record} /> )}
        </tbody>
      </table>
    );
  }
>>>>>>> jupyter
}

render(App, document.getElementById('root'));
export default App;
