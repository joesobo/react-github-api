const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const FormData = require("form-data");
const fetch = require("node-fetch");

const app = express();

const secret = '2128e19c3ebdf8f9bc534d5add5aa90b5c0efc09';

//const access_token = '';

app.use(bodyParser.json());
app.use(bodyParser.json({ type: "text/*" }));
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());

app.use((req, res, next) => {
    console.log('Handling ' + req.path + '/' + req.method);
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Content-Type", "application/json");
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Credentials', true);
    next();
});

app.post("/authenticate", (req, res) => {
    const { client_id, redirect_uri, client_secret, code } = req.body;

    const data = new FormData();
    data.append("client_id", client_id);
    data.append("client_secret", client_secret);
    data.append("code", code);
    data.append("redirect_uri", redirect_uri);

    fetch(`https://github.com/login/oauth/access_token`, {
        method: "POST",
        body: data
    })
    .then(response => response.text())
    .then(paramsString => {
        console.log("PARAMS " + paramsString)
        //TODO: here return either all of params or just access_token (not sure if scope is nessecary)
        let params = new URLSearchParams(paramsString);
        const access_token = params.get("access_token");
        const scope = params.get("scope");
        const token_type = params.get("token_type");

        console.log("2" + access_token);
        return fetch(`https://api.github.com/user?access_token=${access_token}&scope=${scope}&token_type=${token_type}`);
    })
    .then(response => response.json())
    .then(response => {
        return res.status(200).json(response);
    })
    .catch(error => {
        return res.status(400).json(error);
    });
});

app.get("/rate_limit", (req, res) => {
    //console.log("1" + access_token); ?access_token=${access_token}
    fetch(`https://api.github.com/rate_limit`, {
        method: "GET"
    })
    .then(response => response.json())
    .then(response => {
        return res.status(200).json(response);
    })
    .catch(error => {
        return res.status(400).json(error);
    });
});

app.get('/api/secret', withAuth, function(req, res) {
    res.send('The password is potato');
})

const PORT = process.env.SERVER_PORT || 5000;
app.listen(PORT, () => console.log(`Listening on ${PORT}`));