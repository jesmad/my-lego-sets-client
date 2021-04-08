import React from "react";

//Local Components
import NavTrail from "./NavTrail.js";

//Material-UI
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";

const useStyles = (theme) => ({
    pageRoot : {
        flexGrow : 1,
        margin : theme.spacing(2)
    },
    imageContainer : {
        backgroundColor : "rgb(255, 0, 0)"
    },
    setInfoContainer : {
        backgroundColor : "rgb(60, 179, 113)"
    }
});

class SetPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        const {classes} = this.props;
        const {elementInfo} = this.props.location;

        return (
            <div className={classes.pageRoot}>
                <NavTrail elementInfo={elementInfo}/>
                <Grid 
                    container
                    direction="row"
                    spacing={3}
                >
                    <Grid 
                        item
                        className={classes.imageContainer}
                    >
                        <Typography>This is where the image will be</Typography>
                    </Grid>
                    <Grid 
                        item
                        className={classes.setInfoContainer}
                    >
                        <Typography>This is where the element info will be</Typography>
                    </Grid>
                </Grid>
            </div>
        ) 
    }
}

export default withStyles(useStyles)(SetPage);