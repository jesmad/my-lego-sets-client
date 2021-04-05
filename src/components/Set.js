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
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";


//Express API Endpoint (just the URL of the Cloud Function)
const apiURL = "https://us-central1-my-lego-sets.cloudfunctions.net/api2";

//Cloud Storage URL 
const imageURL = "https://firebasestorage.googleapis.com/v0/b/my-lego-sets.appspot.com/o/lego_logo.jpg?alt=media";

const useStyles = (theme) => ({
    card : {
        maxWidth: 300,
        backgroundColor :  "rgb(255,255,255)",
    },
    hover : {
        "&:hover" : {
            opacity : 0.5
        }
    },
    content : {
    },
    media : {
    },
    setNotInCollection: {
    },
    setInCollection : {
        borderColor : "rgb(102, 194, 255)"
    },
    alertMessage : {
        backgroundColor : "rgb(255, 255, 255)",
        color : "rgb(178, 34, 34)"   
    }
});


class Set extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            displayAlert : false
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

    _closeAlert = () => {
        this.setState({displayAlert : false});
    }

    _openAlert = () => {
        this.setState({displayAlert : true});
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
                    set.ownedByCurrUser = true;
                    this.setState({});
                }
            })
            .catch( (error) => {
                alert(`Error with fetch request when adding a set to owned collection: ${error.message}`);
            })
    }

    _removeSetFromCollection = (setInfo, userSessionToken) => {
        let dataToSend = {
            setID : setInfo.setID
        };

        fetch(apiURL + "/remove-owned-set", {
            method : "POST",
            headers : {"Content-Type" : "application/json", "Authorization" : `Bearer ${userSessionToken}`},
            body : JSON.stringify(dataToSend)
        })
            .then( (response) => {
                return response.json();
            })
            .then( (data) => {
                if (!data.hasOwnProperty("error")) {
                    setInfo.ownedByCurrUser = false;
                    this.setState({});
                }
            })
            .catch( (error) => {
                alert(`Unable to remove set from user's collection: ${error.message}`);
            })
    }

    _handleCardClick = (setInfo) => {
        this.props.history.push({
            pathname : `/set/${setInfo.setID}`,
            setInfo : setInfo
        });
    }

    _handleButtonClick = (setInfo, openDialog) => {
        let userSessionToken = localStorage.getItem("userJWT");
        let userLoggedIn = this._checkUserLoginStatus(userSessionToken);

        if (userLoggedIn) {
            let setOwnedAlready = setInfo.ownedByCurrUser;
            if (setOwnedAlready) {
                //Remove set from user's collection
                this._removeSetFromCollection(setInfo, userSessionToken);
            }
            else {
                //Add set to user's collection
                this._addSetToCollection(setInfo, userSessionToken);
            }
            //Display message on screen
            this._openAlert();
        }
        else {
            //User is not logged in, open dialog window by calling parent method
            openDialog();
        }
    }

    render() {
        const { classes, setInfo, redirectToLogin, openDialog, closeDialog, openDialogFlag } = this.props;
        return (
            <div>
                <Card className={classes.card}>
                    <CardMedia
                        component="img"
                        alt="Lego Image"
                        height="90"
                        width="90"
                        image={setInfo.image}
                        title="Lego Image"
                        className={classes.hover}
                        onClick={() => this._handleCardClick(setInfo)}
                    />
                    <CardContent 
                        className={classes.hover}
                        onClick={() => this._handleCardClick(setInfo)}
                    >
                        <Typography variant="h6" style={ {textAlign : "center"} }>{setInfo.setID}: {setInfo.name}</Typography>
                        <Typography variant="subtitle1">MINIFIGS: {setInfo.numOfFigs}</Typography>
                        <Typography variant="subtitle1">PIECES: {setInfo.pieceCount}</Typography>
                        <Typography variant="subtitle1">RRP: {setInfo.price}</Typography>
                    </CardContent>
                    <CardActions>
                        <Button 
                            className={(setInfo.ownedByCurrUser) ? classes.setInCollection : classes.setNotInCollection}
                            size="small" 
                            variant="outlined"
                            onClick={() => this._handleButtonClick(setInfo, openDialog)}
                            startIcon={(setInfo.ownedByCurrUser) ? <RemoveIcon /> : <AddIcon />}
                        >
                            {setInfo.ownedByCurrUser ? "Remove" : "Add"}
                        </Button>
                        <Snackbar
                            className={classes.alertMessage}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            open={this.state.displayAlert} //boolean
                            autoHideDuration={4000} //in milliseconds
                            onClose={this._closeAlert} //function to update open flag
                            message="Changes saved" 
                        />
                        <Dialog
                            open={openDialogFlag}
                            onClose={() => closeDialog()}
                        >
                            <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                Only users with an account are able to add sets to their collection. 
                            </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={() => closeDialog()}>Close</Button>
                                <Button onClick={() => redirectToLogin()}>Go To Login</Button>
                            </DialogActions>
                        </Dialog>
                    </CardActions>
                    
                </Card>
            </div>
        );
    }
};

export default withStyles(useStyles)(Set);