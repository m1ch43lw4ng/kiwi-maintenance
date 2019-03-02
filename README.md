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
### Config
To use this, create a config.js file with the contents and correct credentials 
1. In terminal: `cd src && touch config.js && cd ..`
2. In the config file, copy-paste the following text and fill in the variables:
```js
import config from "react-global-configuration";

config.set({
    apiKey: 'APIKEY',
    baseId: 'BASEID',
    url: 'URL'
});

export default config;

```

### React app
1. Clone the repository `git clone https://github.com/m1ch43lw4ng/kiwi-maintenance`
2. Cd into the correct directory `cd kiwi-maintenance`
2. Install node modules `npm install`
3. use npm to run
```bash
npm start
```
### Jupyter notebook components
1. Clone the repository `git clone https://github.com/m1ch43lw4ng/kiwi-maintenance`
2. Upgrade to recent pip and run `pip install airtable-python-wrapper`
2. Open notebook with `jupyter notebook`
3. Navigate into notebooks directory
4. Run data.ipynb


## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

1. Fork <https://github.com/m1ch43lw4ng/kiwi-maintenance>
2. Clone `git clone https://github.com/USERNAME/kiwi-maintenance`
2. Create feature branch `git checkout -b feature/NAME`
3. Commit your changes `git commit -am 'Added ___'`
4. Push to the branch `push origin feature/NAME`