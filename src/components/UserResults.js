import React from "react";

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

class UserResults extends React.Component {
    constructor(props) {
        super(props);
    };

    render() {
        const { classes, users } = this.props;
        return (
            <div>
                <Grid container spacing={1}>
                    {users.map( (user) => (
                        <Grid item>
                            <Card className={classes.card}>
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
                                    <Typography>{user.userSince}</Typography>
                                </CardContent>
                                <CardActions>
                                    <Button size="small" variant="outlined">View</Button>
                                </CardActions>
                                
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
