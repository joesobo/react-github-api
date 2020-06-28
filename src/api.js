const baseURL = "http://localhost:5000/";

export function getData (endpoint, accessToken) {
    return fetch(baseURL + endpoint, {
        method: "GET",
        headers: {
            Authorization: accessToken
        }
    });
}