import React from "react";

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

  _search = () => {
    //TODO: Every time a user clicks submit for search should I reset the the state (i.e. clear the arrays and negate the flags)???
    this.setState({searchPressed : true, querySets : [], queryUsers: [], showSearchProgress : true});

    //TODO: Maybe might need to replace the spaces of searchValue with "+" or "%20" for the URL
    Promise.allSettled([
      fetch(apiURL + `/search-sets?q=${this.state.searchValue}`, {
        method : "GET",
        headers : {"Content-Type" : "application/json"}
      }),  
      fetch(apiURL + `/search-users?q=${this.state.searchValue}`, {
        method : "GET",
        headers : {"Content-Type" : "application/json"}
      })
    ])
      .then( (results) => {
        //results => [{status: "fulfilled" | "rejected" | "pending", value: Response }, ...]
        let fetchSetsResult = results[0];
        let fetchUsersResult = results[1];

        if (fetchSetsResult.status === "fulfilled" || fetchUsersResult.status === "fulfilled") {
          Promise.allSettled( [fetchSetsResult.value.json(), fetchUsersResult.value.json()])
            .then( (fetchResults) => {
              if (fetchResults[0].status === "fulfilled" || fetchResults[1].status === "fulfilled") {
                this.setState( {querySets : fetchResults[0].value, queryUsers : fetchResults[1].value, showSearchProgress : false} );
              }
              else {
                this.setState( {querySets : [], queryUsers : [], showSearchProgress : false} );
              }
            })
            .catch( (error) => {
              alert(`Error with the Promise.FIRSTallSettled: Code - ${error.code} Message - ${error.message}`);
            })
        }
        else {
          //Both fetch() requests were rejected or are still pending
          this.setState( {querySets : [], queryUsers : [], showSearchProgress : false} );
        }
      })
      .catch( (error) => {
        alert(`Error with the Promise.FIRSTallSettled: Code - ${error.code} Message - ${error.message}`);
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
                  / >
                </Grid>
                <Grid item>
                  <Button 
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
              {this.state.searchPressed ? (
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
              {this.state.searchPressed ? (
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
