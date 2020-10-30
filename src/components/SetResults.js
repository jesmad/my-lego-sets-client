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

class SetResults extends React.Component {
    constructor(props) {
        super(props);
    };

    render() {
        const { classes, sets } = this.props;
        return (
            <div>
                <Grid container spacing={1}>
                    {sets.map( (set) => 
                        <Grid item>
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
                                    <Button size="small" variant="outlined">Add</Button>
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
