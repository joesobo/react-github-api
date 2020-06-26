export const initialState = {
    isLoggedIn: /*JSON.parse(localStorage.getItem("isLoggedIn")) ||*/ false,
    client_id: process.env.REACT_APP_CLIENT_ID,
    redirect_uri: process.env.REACT_APP_REDIRECT_URI,
    client_secret: process.env.REACT_APP_CLIENT_SECRET,
    proxy_url: process.env.REACT_APP_PROXY_URL
};

export const reducer = (state, action) => {
    switch (action.type) {
        case "LOGIN": {
            localStorage.setItem("isLoggedIn", JSON.stringify(action.payload.isLoggedIn))
            localStorage.setItem("accessToken", JSON.stringify(action.payload.accessToken))
            return {
                ...state,
                isLoggedIn: action.payload.isLoggedIn,
                accessToken: action.payload.accessToken
            };
        }
        case "LOGOUT": {
            localStorage.clear();
            return {
                ...state,
                isLoggedIn: false,
                accessToken: ''
            };
        }
        default: 
            return state;
    }
}