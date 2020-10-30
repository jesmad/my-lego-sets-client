import React from "react";

//Material-UI 
import { withStyles } from "@material-ui/core/styles"
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "@material-ui/core/Button";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";

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

class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email : "",
      password : "", 
      confirmPassword : "",
      handle : "",
      errorFlag : false,
      errorMessage : "",
      showProgressCircle: false
    }
  }

  _submitForm = () => {
    this.setState({showProgressCircle : true});
    //Body for fetch()
    let form = {
      email : this.state.email,
      handle : this.state.handle,
      password : this.state.password,
      confirmPassword : this.state.confirmPassword
    };

    fetch(apiURL + "/sign-up", {
      method: "POST",
      body: JSON.stringify(form),
      headers: { "Content-Type": "application/json" },
    })
    .then( (response) => {
      return response.json();
    })
    .then( (data) => {
      if (!data.hasOwnProperty("error")){
        //Successfull signup
        localStorage.setItem("userJWT", data.token);
        this.props.history.push("/home");
        this.setState({showProgressCircle : false});
      }
      else {
        //data => { error : "auth/email-already-in-use" | "auth/passwords-do-not-match" | "auth/handle-already-taken" |
        //                        "auth/invalid-email" | "auth/operation-not-allowed" | "auth/weak-password"}
        let errMessage;
        switch (data.error) {
            case "auth/email-already-in-use":
              errMessage = "Error: Email is already in use."
              break;
          
            case "auth/passwords-do-not-match":
              errMessage = "Error: Passwords do not match."
              break;
            
            case "auth/handle-already-taken":
              errMessage = "Error: User handle is already taken."
              break;
            
            case "auth/invalid-email":
              errMessage = "Error: Email is invalid."
              break;
            
            case "auth/operation-not-allowed":
              errMessage = "Error: Email and/or password are not allowed."
              break;
            
            case "auth/weak-password":
              errMessage = "Error: Password is not strong enough."
              break;
            
            default:
              errMessage =  data.error;
        };
        this.setState( {showProgressCircle : false, errorFlag : true, errorMessage: errMessage})
      }
    })
    .catch( (error) => {
      alert(`Error with fetch('/sign-up'): ${error.message}`)
    })
  }

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
            <Typography>My-Lego-Sets | Signup</Typography>
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
              value={this.state.handle}
              id="outlined-basic"
              label="Handle"
              variant="outlined"
              onChange={(event) => {
                this.setState({ handle: event.target.value });
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
            <TextField
              value={this.state.confirmPassword}
              id="outlined-basic"
              label="Confirm Password"
              type="password"
              variant="outlined"
              onChange={(event) => {
                this.setState({ confirmPassword: event.target.value });
              }}
            ></TextField>
          </Grid>
          <Grid item>
            <Grid 
              container
              spacing={2}
              direction="row"
              alignItems="center"
              justify="center"
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
          {/*Error message that will render if fetch("/sign-up") returned an error */}
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
              <Typography variant="caption" display="block" gutterBottom>
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

export default withStyles(useStyles)(Signup);
