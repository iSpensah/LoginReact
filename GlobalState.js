import React from "react";
import axios from "axios";
import { withRouter } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
// CreateContext
export const globalContext = React.createContext();

// GlobalState
class GlobalStateProvider extends React.Component {
  state = {
    LoginEmail: "",
    LoginPassword: "",
    RegisterUsername: "",
    RegisterEmail: "",
    RegisterPassword: "",
    ConfirmPassword: "",
    CharacterLength: false,
    CapitalLetter: false,
    SpecialSymbol: false,
    UserPosts: [],
    UserPost: "",
    RegisterButtonDisabled: false,
    InvalidCharacterLength: "",
    InvalidSpecialSymbol: "",
    InvalidCapitalLetter: "",
    InvalidConfirmPassword: "",
    InvalidConfirmPasswordWarning: "none",
    RegistrationError: "",
    RegisterAccountSuccess: false,
    LoginFailedWarning: false,
    UserID: "",
    UserUsername: "",
    Loading: false,
    Redirect: false,
    LoginFailedText: "Login Failed",
  };
  // Function for login email input
  loginEmailChange = (e) => {
    let value = e.target.value;
    this.setState({
      ...this.state,
      LoginEmail: value,
    });
  };
  // Function for login password input
  loginPasswordChange = (e) => {
    let value = e.target.value;
    this.setState({
      ...this.state,
      LoginPassword: value,
    });
  };
  // Function for register username input
  registerUsernameChange = (e) => {
    let value = e.target.value;
    this.setState({
      ...this.state,
      RegisterUsername: value,
    });
  };
  // Function for register email input
  registerEmailChange = (e) => {
    let value = e.target.value;
    this.setState({
      ...this.state,
      RegisterEmail: value,
    });
  };
  testRegisterPassword = () => {
    let capRegex = /[A-Z]/;
    let specSymbolRegex = /(?=.*[!@#$%^&*])/;
    let testPasswordLength =
      this.state.RegisterPassword.length >= 8 ? true : false;
    let testPasswordCapitalLetter = capRegex.test(this.state.RegisterPassword);
    let testPasswordSpecialCharacter = specSymbolRegex.test(
      this.state.RegisterPassword
    );
    this.setState({
      ...this.state,
      CharacterLength: testPasswordLength,
      CapitalLetter: testPasswordCapitalLetter,
      SpecialSymbol: testPasswordSpecialCharacter,
    });
  };
  // Function for register password input. Checks to make sure that password meets criteria.
  registerPasswordChange = async (e) => {
    let value = e.target.value;
    await this.setState({
      ...this.state,
      RegisterPassword: value,
    });
    await this.testRegisterPassword();
  };
  // Function to the confirm password input. Last check to make sure that the password the user has typed is correct before saving to database.
  confirmPasswordChange = (e) => {
    let value = e.target.value;
    this.setState({
      ...this.state,
      ConfirmPassword: value,
    });
  };
  // Function for form submit on register account form. Makes post reguest to the backend. If errors then the incorrect input will be highlighted and post request will not happen.
  registerformSubmit = async (e) => {
    e.preventDefault();
    this.setState({
      ...this.state,
      InvalidCharacterLength: "",
      InvalidSpecialSymbol: "",
      InvalidCapitalLetter: "",
      InvalidConfirmPassword: "",
      InvalidConfirmPasswordWarning: "none",
      RegisterAccountSuccess: false,
    });
    let passMatchTest =
      this.state.RegisterPassword === this.state.ConfirmPassword ? true : false;
    if (
      this.state.SpecialSymbol &&
      this.state.CharacterLength &&
      this.state.CapitalLetter &&
      passMatchTest
    ) {
      let res = await axios
        .post("<Backend Server>/Register", {
          registerUsername: this.state.RegisterUsername,
          registerEmail: this.state.RegisterEmail,
          registerPassword: this.state.RegisterPassword,
        })
        .then((response) => {
          this.setState({
            RegisterAccountSuccess: true,
            RegisterUsername: "",
            RegisterEmail: "",
            RegisterPassword: "",
            ConfirmPassword: "",
            CharacterLength: false,
            CapitalLetter: false,
            SpecialSymbol: false,
          });
        })
        .catch((err) => {
          this.setState({
            ...this.state,
            InvalidConfirmPasswordWarning: "",
            RegistrationError: "User Already Exists",
          });
        });
      return res;
    } else {
      if (!this.state.SpecialSymbol) {
        this.setState({
          ...this.state,
          InvalidSpecialCharacter: "1px solid Red",
        });
      }
      if (!this.state.CharacterLength) {
        this.setState({
          ...this.state,
          InvalidCharacterLength: "1px solid Red",
        });
      }
      if (!this.state.CapitalLetter) {
        this.setState({
          ...this.state,
          InvalidCapitalLetter: "1px solid Red",
        });
      }
      if (!passMatchTest) {
        this.setState({
          ...this.state,
          InvalidConfirmPassword: "3px solid Red",
          InvalidConfirmPasswordWarning: "",
          RegistrationError: "Password doesn't match",
        });
      }
    }
  };
  // Function for login form submit. Checks for email and password then makes a post request to the backend.
  loginFormSubmit = async (e) => {
    e.preventDefault();
    this.setState({
      ...this.state,
      LoginFailedWarning: false,
      LoginFailedText: "Login Failed",
    });
    if (!this.state.LoginEmail) {
      this.setState({
        ...this.state,
        LoginFailedText: "Login Failed, No Email",
        LoginFailedWarning: true,
        LoginEmail: "",
        LoginPassword: "",
      });
    } else if (!this.state.LoginPassword) {
      this.setState({
        ...this.state,
        LoginFailedText: "Login Failed, No Password",
        LoginFailedWarning: true,
        LoginEmail: "",
        LoginPassword: "",
      });
    } else {
      await axios
        .post("<Backend Server>/Login", {
          auth: {
            loginEmail: this.state.LoginEmail,
            loginPassword: this.state.LoginPassword,
          },
        })
        .then((response) => {
          this.setState({
            ...this.state,
            LoginEmail: "",
            LoginPassword: "",
            UserID: response.data.id,
            UserUsername: response.data.username,
            Loading: true,
            LoginFailedWarning: false,
            UserPosts: response.data.posts,
          });
          window.sessionStorage.setItem(
            "id",
            JSON.stringify(this.state.UserID)
          );
          window.sessionStorage.setItem(
            "token",
            JSON.stringify(response.data.token)
          );
          this.props.history.push(`/Login/User`);
        })
        .catch((error) => {
          this.setState({
            ...this.state,
            LoginFailedWarning: true,
            LoginEmail: "",
            LoginPassword: "",
          });
        });
    }
  };
  // Function for the input on the /Login/User private route
  inputPostChange = (e) => {
    let value = e.target.value;
    this.setState({
      ...this.state,
      UserPost: value,
    });
  };
  // Function for making adding a post. Makes put request to the backend.
  addPostSubmit = async (e) => {
    e.preventDefault();
    let getId = window.sessionStorage.getItem("id");
    let getToken = window.sessionStorage.getItem("token");
    let userId = JSON.parse(getId);
    let token = JSON.parse(getToken);
    let newUserPost = { id: uuidv4(), post: this.state.UserPost };
    let res = await axios
      .put(`<Backend Server>/${userId}`, {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
        params: {
          post: newUserPost,
        },
      })
      .then((response) => {
        if (response) {
          this.setState({
            ...this.state,
            UserPosts: response.data,
            UserPost: "",
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
    return res;
  };
  // Function for deleting post. Makes delete request to the backend.
  deletePostClick = async (id) => {
    let getId = window.sessionStorage.getItem("id");
    let getToken = window.sessionStorage.getItem("token");
    let userId = JSON.parse(getId);
    let token = JSON.parse(getToken);
    let res = await axios
      .delete(
        `<Backend Server>/${userId}`,
        {
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token,
          },
          data: {
            deletePost: id,
          },
        }
      )
      .then((response) => {
        if (response) {
          this.setState({
            ...this.state,
            UserPosts: response.data,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
    return res;
  };
  // Function for closing the success pop up after you successfully create and user account.
  closeRegisterAccountSuccessClick = () => {
    this.setState({
      ...this.state,
      RegisterAccountSuccess: false,
    });
  };
  // Function for closing the error pop up if user failed to login successfully.
  closeLoginFailedWarningClick = () => {
    this.setState({
      ...this.state,
      LoginFailedWarning: false,
    });
  };
  // Function for /Login/User private route. On the componentDidMount, makes a Get request to the backend to receive the username, id, and posts.
  getUserData = async () => {
    let getId = window.sessionStorage.getItem("id");
    let getToken = window.sessionStorage.getItem("token");
    let userId = JSON.parse(getId);
    let token = JSON.parse(getToken);
    if (!token) {
      this.props.history.push("/Login");
    } else {
      let res = await axios
        .get(`<Backend Server>/${userId}`, {
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token,
          },
        })
        .then((response) => {
          if (response) {
            this.setState({
              ...this.state,
              UserID: response.data.id,
              UserUsername: response.data.username,
              UserPosts: response.data.posts,
            });
          }
        })
        .catch((error) => {
          console.log(error);
          this.props.history.push("/Login");
        });
      return res;
    }
  };
  // Function for logging out of /Login/User route. Resets state and removes JWT and id from session storage
  logOutClick = () => {
    this.setState({
      ...this.state,
      UserID: "",
      UserUsername: "",
      UserPosts: "",
    });
    window.sessionStorage.removeItem("id");
    window.sessionStorage.removeItem("token");
    this.props.history.push("/ReactLoginProject");
  };
  render() {
    return (
      <globalContext.Provider
        value={{
          state: this.state,
          loginEmailChange: this.loginEmailChange,
          loginPasswordChange: this.loginPasswordChange,
          registerUsernameChange: this.registerUsernameChange,
          registerEmailChange: this.registerEmailChange,
          registerPasswordChange: this.registerPasswordChange,
          confirmPasswordChange: this.confirmPasswordChange,
          registerformSubmit: this.registerformSubmit,
          loginFormSubmit: this.loginFormSubmit,
          inputPostChange: this.inputPostChange,
          addPostSubmit: this.addPostSubmit,
          deletePostClick: this.deletePostClick,
          closeRegisterAccountSuccessClick: this
            .closeRegisterAccountSuccessClick,
          closeLoginFailedWarningClick: this.closeLoginFailedWarningClick,
          getUserData: this.getUserData,
          logOutClick: this.logOutClick,
        }}
      >
        {this.props.children}
      </globalContext.Provider>
    );
  }
}
export default withRouter(GlobalStateProvider);