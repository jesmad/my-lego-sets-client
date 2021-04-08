import React from "react";

//Material-UI
import Grid from "@material-ui/core/Grid";
import Skeleton from "@material-ui/lab/Skeleton";
import { withStyles } from "@material-ui/core/styles";

const useStyles = (theme) => ({
    root : {
        margin : theme.spacing(2)
    }
});

class SkeletonLoad extends React.Component {
    render() {
        const { classes } = this.props;
        return (
            <Grid 
                container
                spacing={1}
                direction="column"
                className={classes.root}
            >
                <Grid item>
                    <Skeleton height={75} width="22%" variant="text" /> 
                </Grid>
                <Grid item>
                    <Skeleton variant="rect" width="100%" height={375} />
                </Grid>
                <Grid item>
                    <Skeleton height={75} width="22%" variant="text" /> 
                </Grid>
                <Grid item>
                    <Skeleton variant="rect" width="100%" height={375} />
                </Grid>
            </Grid>
        )
    }
}

export default withStyles(useStyles)(SkeletonLoad);