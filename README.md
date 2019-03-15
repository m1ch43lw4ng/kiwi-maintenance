# kiwi-maintenance

A React web-app to read and write from an Airtable database and sync the different tables in the base.

## Author(s)
* [Michael Wang](http://m1ch43lw4ng.com), http://github.com/m1ch43lw4ng

## Built With
* [Airtable API](https://airtable.com)
* React.js
* Node.js
* Bootstrap

## Usage
### Running Locally
To use this app for a table, create a .env file with the contents and correct credentials for that table.
1. In terminal: `touch .env`
2. Open .env (if using Sublime, run `open -a Sublime\ Text.app .env`)
2. In the .env file, copy-paste the following text and fill in the variables:
```js
REACT_APP_apiKey='YOUR_KEY'
REACT_APP_baseID='YOUR_BASE'
REACT_APP_url='YOUR_URL'
```

### Running on a Server
1. Setting keys in Heroku:
```bash
heroku config:set REACT_APP_apiKey='YOUR_KEY' REACT_APP_baseID='YOUR_BASE' REACT_APP_url='YOUR_URL'
```

### React app
1. Clone the repository `git clone https://github.com/m1ch43lw4ng/kiwi-maintenance`
2. Cd into the correct directory `cd kiwi-maintenance`
3. Install node modules `npm install`
4. use npm to run
```bash
npm start
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

1. Fork <https://github.com/m1ch43lw4ng/kiwi-maintenance>
2. Clone `git clone https://github.com/USERNAME/kiwi-maintenance`
2. Create feature branch `git checkout -b feature/NAME`
3. Commit your changes `git commit -am 'Added ___'`
4. Push to the branch `push origin feature/NAME`
