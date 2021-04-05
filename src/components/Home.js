import React from "react";

//JWT-Decode
import jwt_decode from "jwt-decode";

//Material-UI
import Divider from "@material-ui/core/Divider";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import LinearProgress from "@material-ui/core/LinearProgress";

//Local Component
import SetResults from "./SetResults.js";
import UserResults from "./UserResults.js";

//Express API Endpoint (just the URL of the Cloud Function)
const apiURL = "https://us-central1-my-lego-sets.cloudfunctions.net/api2";

const useStyles = (theme) => ({
  homeRoot : {
    //backgroundColor: "pink",
    flexGrow: 1,
    minHeight: "80vh"
  },
  gridRow : {
    //backgroundColor: "blue",
    margin: theme.spacing(2),
  },
  paperRow : {
    minHeight : theme.spacing(40),
    padding : theme.spacing(1)
  },
  topDivider : {
    margin : theme.spacing(1, "auto", "auto", "auto")
  },
  heading : {
    textAlign : "left",
    padding: theme.spacing(1),
    color: "rgb(136,136,136)",
    fontSize: 34
  },
  searchButton : {
    backgroundColor : "rgb(33, 150, 243)",
    color : "rgb(255, 255, 255)"
  }

});

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchValue : "",
      searchPressed : false,
      showSearchProgress : false,
      querySets : [],
      //querySetsModified : false,
      queryUsers : []
      //queryUsersModified : false
      //openDialog : false,
      //closeDialog : false
    };
  }

  _checkJWTExp = (decodedToken) => {
      //Date.now() => milliseconds since UNIX - "start" of time (1/1/1970)
      //decodedToken.exp => seconds since UNIX - "start" of time (1/1/1970)
      return ( (Date.now() >= decodedToken.exp * 1000) ? true : false );
  }

  _checkUserLoginStatus = (userSessionToken) => {
      if (userSessionToken) {
          //Check that the JWT has not expired
          let decodedToken = jwt_decode(userSessionToken);
          return (this._checkJWTExp(decodedToken) === false) ? true : false;
      }
      return false;
  }

  _loadState = (arrayPromiseOutcomes, currUserCollection) => {
    //Add the values from the resolved fetch requests to the state=
    //Add a 'ownedByCurrUser' property to each set object to distinguish which sets the currently logged in user owns
    let requestForSets = arrayPromiseOutcomes[0];
    let requestForUsers = arrayPromiseOutcomes[1];
    let sets = requestForSets.value;

    if ( (requestForSets.status === "rejected" || requestForSets.status === "pending") && requestForUsers.status === "fulfilled") {
      this.setState( {showSearchProgress : false, querySets : [], queryUsers : requestForUsers.value});
    }
    else if (requestForSets.status === "fulfilled" && (requestForUsers.status === "rejected" || requestForUsers.status === "pending") ) {
      for (let i = 0; i < sets.length; i++) {
        sets[i].ownedByCurrUser = currUserCollection.includes(sets[i].setID);
      }
      this.setState( {showSearchProgress : false, querySets : requestForSets.value, queryUsers : []});
    }
    else if (requestForSets.status === "fulfilled" && requestForUsers.status === "fulfilled") {
      for (let i = 0; i < sets.length; i++) {
        sets[i].ownedByCurrUser = currUserCollection.includes(sets[i].setID);
      }
      this.setState({showSearchProgress : false, querySets : requestForSets.value, queryUsers : requestForUsers.value});
    }
    else if ( requestForSets.status === "pending" && requestForUsers.status === "pending" ) {
      this.setState({showSearchProgress : false, querySets : [], queryUsers : []});
    }
    else {
      this.setState({showSearchProgress: false, querySets : [], queryUsers : []});
      alert("Uh oh! Something went wrong in our side.");
    }
  }

  _search = () => {
    this.setState({searchPressed : true, querySets : [], queryUsers: [], showSearchProgress : true});

    //If there is a user currently logged, fetch the user's collection and fetch the results for the search query.
    //If there is not a user currently logged in, fetch the results for the search query.
    Promise.allSettled([
      fetch(apiURL + `/search-sets?q=${this.state.searchValue}`, {
        method : "GET",
        headers : {"Content-Type" : "application/json"}
      })
      .then( (response) => {
        return response.json();
      })
      ,  
      fetch(apiURL + `/search-users?q=${this.state.searchValue}`, {
        method : "GET",
        headers : {"Content-Type" : "application/json"}
      })
      .then( (response) => {
        return response.json();
      })
    ])
    .then( (arrayPromiseOutcomes) => {
      //data => [{status: "fulfilled" | "rejected" | "pending", value: Response }, ...]
      let userSessionToken = localStorage.getItem("userJWT");
      let userLoggedIn = this._checkUserLoginStatus(userSessionToken);

      if (!userLoggedIn) {
        //User is not logged in. Determine the outcome of the resolved fetches and store the values in the state
        this._loadState(arrayPromiseOutcomes, []);
      }
      else {
        fetch(apiURL + `/authenticate-user/${userSessionToken}`, {
          method : "GET",
          headers : {"Content-Type" : "application/json"}
        })
        .then( (response) => {
          return response.json();
        })
        .then( (userData) => {
          let userCollection = userData.collection;
          this._loadState(arrayPromiseOutcomes, userCollection);
        })
        .catch( (error) => {
          console.log("Uh oh! Having trouble authenticating user when searching for the query");
          alert("Trouble when authenticating user during search");
        })
      }
    })
    .catch( (error) => {
      console.log("ERROR WITH PROMISE.ALLSETTLED()");
      alert("Unable to resolve the requests for sets and users");
    })
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.homeRoot}>
        <Grid 
          container
          direction="column"
          justify="center"
          alignItems="stretch"
          spacing={2}
        >
          <Grid item className={classes.gridRow}>
            <Paper elevation={0}>
              <Grid 
                container
                spacing={2}
                direction="row"
                alignItems="center"
                justify="center"
              >
                <Grid item>
                  <TextField 
                    id="outlined-search"
                    variant="outlined"
                    type="search"
                    label="Search"
                    value={this.state.searchValue}
                    onChange={(event) => {
                      this.setState({searchValue : event.target.value})
                    }}
                  />
                </Grid>
                <Grid item>
                  <Button 
                    className={classes.searchButton}
                    type="submit"
                    variant="contained"
                    onClick={this._search}
                  >
                    Search
                  </Button>
                </Grid>
              </Grid> 
            </Paper>
          </Grid>
          <Divider variant="middle" />
          <Grid item className={classes.gridRow}>
            <Typography className={classes.heading} variant="h1">Users</Typography>
            <Paper elevation={2} className={classes.paperRow}>
              {this.state.showSearchProgress && (
                <LinearProgress />
              )}
              {this.state.searchPressed && this.state.queryUsers.length >= 1 ? (
                //Display linear progress bar from the moment the user clicks the 
                //search button to the moment SetResults finishes rendering its content
                <UserResults users={this.state.queryUsers} history={this.props.history}/>
              ) : ( 
                <Typography>NO USERS TO SHOW</Typography>
              )}
            </Paper>
          </Grid>
          <Grid item className={classes.gridRow}>
            <Typography className={classes.heading} variant="h1">Sets</Typography>
            <Paper elevation={2} className={classes.paperRow}>
              {this.state.showSearchProgress && (
                <LinearProgress />
              )}
              {this.state.searchPressed && this.state.querySets.length >= 1 ? (
                //Display linear progress bar from the moment the user clicks the 
                //search button to the moment SetResults finishes rendering its content
                <SetResults sets={this.state.querySets} history={this.props.history}/>
              ) : ( 
                <Typography>NO SETS TO SHOW</Typography>
              )}
            </Paper>
          </Grid>
        </Grid>
      </div>
    )

  }
}

export default withStyles(useStyles)(Home);
