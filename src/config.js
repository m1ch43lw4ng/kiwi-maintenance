import config from "react-global-configuration";

config.set({
    apiKey: process.env.apiKey,
    baseId: process.env.baseID,
    url: process.env.url,
});

export default config;
