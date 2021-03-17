import React from "react";
import { globalContext } from "../Context/GlobalState";
import PropTypes from "prop-types";
class Login extends React.Component {
  render() {
    return (
      <div>
        <form
          onSubmit={(e) => this.context.loginFormSubmit(e)}
          className="container CreateAccountForm"
        >
          <label>Email: for showcase use TestUser@email.com</label>
          <input
            onChange={(e) => this.context.loginEmailChange(e)}
            htmlFor="Email"
            type="email"
            required
            name="LoginEmail"
            value={this.context.state.LoginEmail}
            placeholder="Enter Email"
          ></input>
          <label>Password: for showcase use P@ssword123</label>
          <input
            onChange={(e) => this.context.loginPasswordChange(e)}
            htmlFor="Password"
            type="password"
            required
            name="LoginPassword"
            value={this.context.state.LoginPassword}
            placeholder="Enter Password"
          ></input>
          <button className="btn-primary" type="Submit">
            Login
          </button>
        </form>
        <div
          style={{
            display: this.context.state.LoginFailedWarning ? "" : "none",
          }}
          className="container alert alert-danger LoginFailedAlert"
        >
          {this.context.state.LoginFailedText}
          <button
            onClick={this.context.closeLoginFailedWarningClick}
            className="btn-close "
          ></button>
        </div>
      </div>
    );
  }
}
Login.contextType = globalContext;
// PropTypes
Login.propTypes = {
  loginFormSubmit: PropTypes.func,
  loginEmailChange: PropTypes.func,
  LoginEmail: PropTypes.string,
  loginPasswordChange: PropTypes.func,
  LoginPassword: PropTypes.string,
  LoginFailedWarning: PropTypes.bool,
  closeLoginFailedWarningClick: PropTypes.func,
};
export default Login;