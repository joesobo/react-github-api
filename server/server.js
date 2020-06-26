const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const FormData = require("form-data");
const fetch = require("node-fetch");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.json({ type: "text/*" }));
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());

app.use((req, res, next) => {
    console.log('Handling ' + req.path + '/' + req.method);
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Content-Type", "application/json");
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
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
        //TODO: here return either all of params or just access_token (not sure if scope is nessecary)
        let params = new URLSearchParams(paramsString);
        const access_token = params.get("access_token");
        const scope = params.get("scope");
        const token_type = params.get("token_type");

        return res.status(200).json(access_token);
    });
});

app.get("/rate_limit", (req, res) => {
    fetch(`https://api.github.com/rate_limit`, {
        method: "GET",
        headers: {
            Authorization: "Bearer " + req.headers.authorization
        }
    })
    .then(response => response.json())
    .then(response => {
        return res.status(200).json(response);
    })
    .catch(error => {
        return res.status(400).json(error);
    });
});

app.get("/users/:name/repos", (req, res) => {
    var name = req.params.name;
    var sorted = req.query.sort;

    fetch(`https://api.github.com/users/${name}/repos?sort=${sorted}`, {
        method: "GET",
        headers: {
            Authorization: "Bearer " + req.headers.authorization
        }
    })
    .then(response => response.json())
    .then(response => {
        return res.status(200).json(response);
    })
    .catch(error => {
        return res.status(400).json(error);
    });
});

app.get("/users/:name/followers", (req, res) => {
    var name = req.params.name;

    fetch(`https://api.github.com/users/${name}/followers`, {
        method: "GET",
        headers: {
            Authorization: "Bearer " + req.headers.authorization
        }
    })
    .then(response => response.json())
    .then(response => {
        return res.status(200).json(response);
    })
    .catch(error => {
        return res.status(400).json(error);
    });
});

app.get("/users/:name/following", (req, res) => {
    var name = req.params.name;

    fetch(`https://api.github.com/users/${name}/following`, {
        method: "GET",
        headers: {
            Authorization: "Bearer " + req.headers.authorization
        }
    })
    .then(response => response.json())
    .then(response => {
        return res.status(200).json(response);
    })
    .catch(error => {
        return res.status(400).json(error);
    });
});

app.get("/repos/:userName/:repoName/stats/contributors", (req, res) => {
    var userName = req.params.userName;
    var repoName = req.params.repoName;

    fetch(`https://api.github.com/repos/${userName}/${repoName}/stats/contributors`, {
        method: "GET",
        headers: {
            Authorization: "Bearer " + req.headers.authorization
        }
    })
    .then(response => response.json())
    .then(response => {
        return res.status(200).json(response);
    })
    .catch(error => {
        return res.status(400).json(error);
    });
});

app.get("/repos/:userName/:repoName/commits", (req, res) => {
    var userName = req.params.userName;
    var repoName = req.params.repoName;

    fetch(`https://api.github.com/repos/${userName}/${repoName}/commits`, {
        method: "GET",
        headers: {
            Authorization: "Bearer " + req.headers.authorization
        }
    })
    .then(response => response.json())
    .then(response => {
        return res.status(200).json(response);
    })
    .catch(error => {
        return res.status(400).json(error);
    });
});

const PORT = process.env.SERVER_PORT || 5000;
app.listen(PORT, () => console.log(`Listening on ${PORT}`));