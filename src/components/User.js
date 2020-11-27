import React from "react";

//Material-UI
import Paper from "@material-ui/core/Paper";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

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
  userPhoto : {
      heigh: 140
  },
  paperRow : {
    minHeight : theme.spacing(50),
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

class User extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            displaySets : false,
            userSets : [],
            userInfo : null
        };
    }

    componentDidMount() {
        //const { userHandle } = this.props.match.params;
        const { user } = this.props.location; //history.location is populated with user from the UserResults component when the user is clicked
        
        let body = {
            handle : user.handle
        };

        //Fetch the user's LEGO collection
        fetch(apiURL + "/get-sets-of-user", {
            method : "POST",
            headers : {"Content-Type" : "application/json"},
            body : JSON.stringify(body)
        })
            .then( (response) => {
                return response.json();
            })
            .then( (data) => {
                this.setState({userSets : data, userInfo : user});
            })
            .catch( (error) => {
                alert('ERRROR FETCHING USER LEGO COLLECTION');
            });
    }

    render() {
        const { userHandle } = this.props.match.params;
        const { classes } = this.props;

        return (
            <div className={classes.homeRoot}>
                <Grid 
                    container
                    spacing={2}
                    direction="column"
                    justify="flex-start"
                    alignItems="stretch"
                >
                    <Grid item className={classes.gridRow}>
                        <Paper elevation={3} className={classes.paperRow}>
                            <Grid 
                                container
                                spacing={2}
                                direction="row"
                                justify="center"
                                alignItems="center"
                            >
                                <Grid item>
                                    <CardMedia
                                        className={classes.userPhoto}
                                    />
                                </Grid>
                                <Grid item>
                                    User INfo
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                    <Grid item className={classes.gridRow}>
                        { !this.state.displaySets && 
                            <Paper elevation={3} className={classes.paperRow}>
                                <Grid container spacing={1}>
                                    {this.state.userSets.map( (set) => 
                                        <Grid item>
                                            <Card>
                                                <Typography>{set.name}</Typography>
                                                <Typography>{set.setID}</Typography>
                                            </Card>
                                        </Grid>    
                                    )}
                                </Grid>
                            </Paper>
                        }                        
                    </Grid>
                </Grid>
            </div>
        );
    }
}

export default withStyles(useStyles)(User);