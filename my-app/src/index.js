import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import ShapeInfoForm from "./ShapeInfoForm";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Switch>
        <Route exact path='/'>
          <App />
        </Route>

        <Route path='/shape-info-form/:shape/:id'>
          <ShapeInfoForm />
        </Route>

        <Route render={() => <Redirect to='/' />} />
      </Switch>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
