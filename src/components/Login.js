import React from "react";

//Material-UI
import Button from "@material-ui/core/Button";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";
import { TextField } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";

//Express API Endpoint (just the URL of the Cloud Function)
const apiURL = "https://us-central1-my-lego-sets.cloudfunctions.net/api2";

const useStyles = (theme) => ({
  rootGrid: {
    flexGrow: 1,
    minHeight: "80vh",
    //minWidth: "100vw",
  },
  errorStyle: {
    color: "red",
    fontSize: 15,
  },
});

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      errorFlag: false,
      errorMessage: "",
      showProgressCircle: false
    };
  }

  _submitForm = () => {
    //TODO: Ensure that the email and password fields are appropriately populated with text
    this.setState({ showProgressCircle : true});

    //console.log("email: ", this.state.email);
    //console.log("password: ", this.state.password);

    //Body of fetch()
    let form = {
      email: this.state.email,
      password: this.state.password,
    };

    fetch(apiURL + "/login", {
      method: "POST",
      body: JSON.stringify(form),
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        //data => { message : "Signed in ... with email: ...", token : "some_JWT"} when SUCCESS
        //     => { error : some_error_code_ } when FAIL
        if (!data.hasOwnProperty("error")) {
          localStorage.setItem("userJWT", data.token);
          this.props.history.push("/home");
          this.setState({showProgressCircle : false});

        } else {
          //ERROR => {data.error : "auth/invalid-email" | "auth/user-disabled" | "auth/user-not-found" | "auth/wrong-password"}
          let message;
          switch (data.error) {
            case "auth/invalid-email":
              message = "Error: Email is invalid.";
              break;
            case "auth/user-disabled":
              message = "Error: Account is disabled. Try again later.";
              break;
            case "auth/user-not-found":
              message = "Error: User not found.";
              break;
            case "auth/wrong-password":
              message = "Error: Password is incorrect.";
              break;
            default:
              message = data.error;
          }
          this.setState({ showProgressCircle : false, errorFlag: true, errorMessage: message });
        }
      })
      .catch((error) => {
        alert(`Issue with fetch('.../login'): ${error.message}`);
      });
  };

  render() {
    const { classes } = this.props;
    return (
      <React.Fragment>
        <Grid
          className={classes.rootGrid}
          container
          direction="column"
          justify="center"
          alignItems="center"
          spacing={2}
        >
          <Grid item>
            <Typography>My-Lego-Sets | Login</Typography>
          </Grid>
          <Grid item>
            <TextField
              value={this.state.email}
              id="outlined-basic"
              label="Email"
              variant="outlined"
              onChange={(event) => {
                this.setState({ email: event.target.value });
              }}
            ></TextField>
          </Grid>
          <Grid item>
            <TextField
              value={this.state.password}
              id="outlined-basic"
              label="Password"
              type="password"
              variant="outlined"
              onChange={(event) => {
                this.setState({ password: event.target.value });
              }}
            ></TextField>
          </Grid>
          <Grid item>
            <Grid 
              container
              justify="center"
              alignItems="center"
              direction="row"
              spacing={2}
            >
              <Grid item>
                <Button
                  disabled={this.state.showProgressCircle}
                  type="submit"
                  variant="outlined"
                  color="secondary"
                  onClick={this._submitForm}
                >
                  Submit
                </Button>
              </Grid>
              <Grid item>
                {this.state.showProgressCircle && (
                  <CircularProgress size={28} />
                )}
              </Grid>
            </Grid>
          </Grid>
          {/*Error message that will render if fetch("/login") returned an error */}
          <Grid item>
            {/* Short Circuit Condition => A && B - B will execute if A evaluates to true */}
            {this.state.errorFlag && (
              <Typography className={classes.errorStyle}>
                {this.state.errorMessage}
              </Typography>
            )}
          </Grid>

          {/*TODO: Add text and a hyperlink to redirect user to the sign up page */}
          <Grid
            container
            spacing={2}
            direction="row"
            justify="center"
            alignItems="center"
          >
            <Grid item>
              <Typography variant="caption" gutterBottom>
                Don't have an account, start
              </Typography>
            </Grid>
            <Grid item>
              <Link component="button" variant="caption">
                here.
              </Link>
            </Grid>
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}

export default withStyles(useStyles)(Login);
