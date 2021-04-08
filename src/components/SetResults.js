import React from "react";

//Local Components
import Set from "./Set.js";

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
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";



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

    },
    setNotInCollection: {

    },
    setInCollection : {
        //backgroundColor : "rgb(34,139,34)"
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

    _openDialog = () => {
        this.setState( {openDialog : true} );
    }

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
            name : set.name,
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
                    
                    ////this.setState( {snackMessage : "Set added to your collection", displaySnack : true});
                }
                else {
                    //TODO: Dialog box to show that the set was not added to the collection because A. Set is already owned by the user or B. Some server side issue.
                    ////this.setState( {snackMessage : "Unable to add set to your collection", displaySnack : true});
                }
            })
            .catch( (error) => {
                alert(`Error with fetch request when adding a set to owned collection: ${error.message}`);
            })
    }

    _checkUserLoginStatus = (userSessionToken) => {
        if (userSessionToken) {
            //Check that the JWT has not expired
            let decodedToken = jwt_decode(userSessionToken);
            return (this._checkJWTExp(decodedToken) === false) ? true : false;
        }
        return false;
    }

    
    _addSet = (set) => {
        /* TODO:
            Check that the user is authenticated 
            if user is not authenticated => redirect user to login page
            else => initiate a dialog box that notifies the user that the set will be added to their collection
                    Disable the button or change it to reflect that the user already has that set in their collection
        */
        let userSessionToken = localStorage.getItem("userJWT");
        let userLoggedIn = this._checkUserLoginStatus(userSessionToken);

        if (userLoggedIn) {
            //Add set to collection
            this._addSetToCollection(set, userSessionToken);
        }
        else {
            //User is not logged in. Display alert dialog.
            this.setState( {openDialog : true} );
        }
    }

    _flagUserSets = (userHandle, userCollection, displayedSets) => {
        let lenDisSets = displayedSets.length;
        for (let i = 0; i < lenDisSets; i++) {
            displayedSets[i].ownedByCurrUser = userCollection.includes(displayedSets[i].setID);
        }
        //this.setState({});
    }

    _currUserSets = (displayedSets) => {
        let userSessionToken = localStorage.getItem("userJWT");
        let currUserLoggedInStatus = this._checkUserLoginStatus(userSessionToken);

        //If the user is not logged in or JWT is expired, exit this function.
        if (!currUserLoggedInStatus) return;

        //Ensure user is authenticated. Retrieve their handle and collection.
        fetch(apiURL + `/authenticate-user/${userSessionToken}`, {
            method : 'GET',
            headers : {'Content-Type' : 'application/json'}
        })
        .then( (response) => {
            return response.json();
        })
        .then( (data) => {
            let userHandle = data.handle;
            let userCollection = data.collection;
            this._flagUserSets(userHandle, userCollection, displayedSets);
        })
        .catch( (error) => {
            alert('Unable to retrieve the handle of currently logged in user');
        });
    }

    render() {
        const { classes, sets } = this.props;
        
        //Distinguish which sets are in the current user's collection by adding a property to each 'set' object
        return (
            <div>
                <Grid container spacing={1}>
                    {sets.map( (set) => ( 
                    <Grid item key={set.setID}>
                        <Set 
                            setInfo={set} 
                            openDialogFlag={this.state.openDialog}
                            closeDialog={this._closeDialog}
                            openDialog={this._openDialog}
                            redirectToLogin={this._redirectToLogin}
                            history={this.props.history}
                        />
                    </Grid>
                    ))}
                </Grid>
            </div>
        )
    }
};

export default withStyles(useStyles)(SetResults);
