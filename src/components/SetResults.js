import React from "react";

//JWT-Decode
import jwt_decode from "jwt-decode";

//Material-UI
import {withStyles} from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import CardActions from "@material-ui/core/CardActions";
import Paper from "@material-ui/core/Paper";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContentText from "@material-ui/core/DialogContentText";
import Snackbar from "@material-ui/core/Snackbar";
import Slide from "@material-ui/core/Slide";
import Grow from "@material-ui/core/Grow";



//Express API Endpoint (just the URL of the Cloud Function)
const apiURL = "https://us-central1-my-lego-sets.cloudfunctions.net/api2";

//Cloud Storage URL 
const imageURL = "https://firebasestorage.googleapis.com/v0/b/my-lego-sets.appspot.com/o/lego_logo.jpg?alt=media";

const useStyles = (theme) => ({
    card : {
        maxWidth: 300,
        backgroundColor :  "rgb(245,245,245)"
    },
    content : {

    },
    media : {

    }
});

function SlideTransition(props) {
    return <Slide {...props} direction="up" />
}

function GrowTransition(props) {
    return <Grow {...props} />
}
class SetResults extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            openDialog : false,
            displaySnack : false,
            Transition : GrowTransition,
            //Transition : SlideTransition,
            snackMessage : ""
        }
    };

    _closeDialog = () => {
        this.setState( {openDialog : false});
    }

    _redirectToLogin = () => {
        this._closeDialog();
        this.props.history.push("/login");
    }

    _checkJWTExp = (decodedToken) => {
        //Date.now() => milliseconds since UNIX - "start" of time (1/1/1970)
        //decodedToken.exp => seconds since UNIX - "start" of time (1/1/1970)
        return ( (Date.now() >= decodedToken.exp * 1000) ? true : false );
    }

    _handleCloseSnack = () => {
        this.setState({displaySnack : false, snackMessage : ""});
    }

    _addSetToCollection = (set, userJWT) => {
        //Add set to user's collection by initiating a fetch request with the proper headers
        let dataToSend = {
            setID : set.setID,
            numOfFigs : set.numOfFigs,
            pieceCount : set.pieceCount,
            price : set.price,
            theme : set.theme,
            yearReleased : set.yearReleased,
            image : imageURL
        };

        fetch(apiURL + "/add-set-to-owned", {
            method : "POST",
            headers : {"Content-Type" : "application/json", "Authorization" : `Bearer ${userJWT}`},
            body : JSON.stringify(dataToSend)
        })
            .then( (response) => {
                return response.json();
            })
            .then( (data) => {
                if (!data.hasOwnProperty("error")) {
                    //Set was added successfully
                    //TODO: Indicate that the set was added successfully to user's collection
                    //TODO: Change the text of the button to reflect that the set is already in user's collection OR
                    //if bring up dialog box stating that the set will be removed from the collection                    
                    this.setState( {snackMessage : "Set added to your collection", displaySnack : true});
                }
                else {
                    //TODO: Dialog box to show that the set was not added to the collection because A. Set is already owned by the user or B. Some server side issue.
                    this.setState( {snackMessage : "Unable to add set to your collection", displaySnack : true});
                    
                }
            })
            .catch( (error) => {
                alert(`Error with fetch request when adding a set to owned collection: ${error.message}`);
            })
    }

    _addSet = (set) => {
        /* TODO:
            Check that the user is authenticated 
            if user is not authenticated => redirect user to login page
            else => initiate a dialog box that notifies the user that the set will be added to their collection
                    Disable the button or change it to reflect that the user already has that set in their collection
        */
        
        let userSessionToken = localStorage.getItem("userJWT");

        if (userSessionToken) {
            //Check that the JWT is not expired
            let decodedToken = jwt_decode(userSessionToken);
            if (this._checkJWTExp(decodedToken) === false) {
                //Add set to user's collection
                this._addSetToCollection(set, userSessionToken);
                return;
            }
            else {
                //JWT has expired
                this.props.history.push("/login");
            }
        }
        else {
            //User is not logged in. Open alert dialog.
            this.setState({openDialog : true});
        }
    }

    render() {
        const { classes, sets } = this.props;
        return (
            <div>
                <Grid container spacing={1}>
                    {sets.map( (set) => 
                        <Grid item key={set.setID}>
                            <Card className={classes.card}>
                                <CardMedia
                                    component="img"
                                    alt="Lego Image"
                                    height="90"
                                    width="90"
                                    image={set.image}
                                    title="Lego Image"
                                />
                                <CardContent>
                                    <Typography variant="h6" style={ {textAlign : "center"}}>{set.setID}: {set.name}</Typography>
                                    <Typography variant="subtitle1">MINIFIGS: {set.numOfFigs}</Typography>
                                    <Typography variant="subtitle1">PIECES: {set.pieceCount}</Typography>
                                    <Typography variant="subtitle1">RRP: {set.price}</Typography>
                                </CardContent>
                                <CardActions>
                                    <Button size="small" variant="outlined" onClick={() => this._addSet(set)}>Add</Button>
                                    <Snackbar
                                        open={this.state.displaySnack}
                                        onClose={this._handleCloseSnack}
                                        TransitionComponent={this.state.Transition}
                                        message={this.state.snackMessage}
                                        //key={this.state.Transition.name}
                                        autoHideDuration={3000}
                                        //style={ {backgroundColor : "rgb(55, 255, 48)"}}

                                    />
                                    <Dialog
                                        open={this.state.openDialog}
                                        onClose={this._closeDialog}
                                    >
                                        <DialogContent>
                                        <DialogContentText id="alert-dialog-description">
                                            Only users with an account are able to add sets to their collection. 
                                        </DialogContentText>
                                        </DialogContent>
                                        <DialogActions>
                                            <Button onClick={this._closeDialog}>Close</Button>
                                            <Button onClick={this._redirectToLogin}>Go To Login</Button>
                                        </DialogActions>
                                    </Dialog>
                                </CardActions>
                                
                            </Card>
                        </Grid>
                    
                    )}
                </Grid>
            </div>
        )
    }
};

export default withStyles(useStyles)(SetResults);
