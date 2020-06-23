import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import axios from "axios";

require("dotenv").config({ path: "../../.env" });

class App extends Component {
  constructor() {
    super();
    this.state = {
      CLIENT_ID: "0f1923fccfb04f618646d8014c16fbbf",
      REDIRECT_URI: "http://localhost:3000/auth",
      SCOPE: "",
      AUTH_URL: "",
      ACCESS_TOKEN: "",
      REFRESH_TOKEN: "",
    };
  }

  async componentDidMount() {
    this.genAuthURL();
    let searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get("code")) {
      await this.requestToken(searchParams.get("code"));

      // eslint-disable-next-line no-restricted-globals
      history.pushState(null, null, "/");
    }
  }

  componentDidUpdate() {
    console.log(this.state);
  }

  genAuthURL() {
    let urlParams = new URLSearchParams({
      client_id: this.state.CLIENT_ID,
      response_type: "code",
      redirect_uri: this.state.REDIRECT_URI,
      scope: this.state.SCOPE,
    });

    this.setState({
      AUTH_URL: `https://accounts.spotify.com/authorize?${urlParams.toString()}`,
    });
  }

  async requestToken(code) {
    try {
      let res = await axios({
        url: "http://localhost:8080/auth/",
        method: "POST",
        data: {
          code,
        },
      });
      this.setState({ ACCESS_TOKEN: res.data.access_token });
      this.setState({ REFRESH_TOKEN: res.data.refresh_token });
      return res;
    } catch (e) {
      console.log(e.response.data);
    }
  }

  async refreshToken(refresh_token) {
    try {
      let res = await axios({
        url: "http://localhost:8080/auth/refresh",
        method: "POST",
        data: {
          refresh_token,
        },
      });

      this.setState({ ACCESS_TOKEN: res.data.access_token });
    } catch (e) {
      console.log(e.response.data);
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          {this.state.AUTH_URL && <a href={this.state.AUTH_URL}>Login</a>}
        </header>
      </div>
    );
  }
}

export default App;
