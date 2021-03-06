import React, { createContext, useReducer } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login/Login";
import { initialState, reducer } from "./store/reducer/index.js";

export const AuthContext = createContext();

function App() {
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <AuthContext.Provider
          value={{
              state,
              dispatch
          }}
        >
            <Router>
                <Switch>
                    <Route path="/login" component={Login}/>
                    <Route path="/" component={Home}/>
                </Switch>
            </Router>
        </AuthContext.Provider>
    );
}

export default App;