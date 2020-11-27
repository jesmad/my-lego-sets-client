import React from "react";

//React-Router-Dom
import { Link } from "react-router-dom";

//Material-UI
import {withStyles} from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardMedia from "@material-ui/core/CardMedia";
import CardActions from "@material-ui/core/CardActions";

import Paper from "@material-ui/core/Paper";

const useStyles = (theme) => ({
    card : {
        maxWidth: 300,
        backgroundColor :  "rgb(245,245,245)",
        
    },
    content : {

    },
    media : {

    }
});

class UserResults extends React.Component {
    constructor(props) {
        super(props);
    
    }

    _viewUser = (user) => {
        //TODO: Open up a new page and populate the page with the user's collection
        this.props.history.push({
            pathname : `/user/${user.handle}`,
            user : user
        });
        //this.props.history.push(`/user/${user.handle}`);
    }


    render() {
        const { classes, users } = this.props;
        return (
            <div>
                <Grid container spacing={1}>
                    {users.map( (user) => (
                        <Grid item key={user.userID}>
                            <Card className={classes.card} onClick={() => this._viewUser(user)}>
                                <CardActionArea>
                                    <CardMedia
                                        component="img"
                                        alt="No-Image"
                                        height="90"
                                        width="90"
                                        image={user.image}
                                        title="No-Image"
                                    />
                                    <CardContent>
                                        <Typography>{user.handle}</Typography>
                                    </CardContent>
                                </CardActionArea>

                                    {/*
                                <CardActions>
                                    <Button size="small" variant="outlined">View</Button>
                                </CardActions>
                                    */}
                            </Card>
                        </Grid>
                    )
                    )}
                </Grid>
            </div>
        )
    }
};

export default withStyles(useStyles)(UserResults);
