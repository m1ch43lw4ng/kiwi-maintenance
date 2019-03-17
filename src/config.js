import config from "react-global-configuration";

config.set({
    apiKey: process.env.REACT_APP_apiKey,
    baseID: process.env.REACT_APP_baseID,
    url: process.env.REACT_APP_url,
});

export default config;
