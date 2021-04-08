import React from "react";

//Material-UI
import Typography from '@material-ui/core/Typography';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import {withStyles} from "@material-ui/core/styles";

const useStyles = (theme) => ({
    container : {
        margin : theme.spacing(2)
    }
});

class NavTrail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    _handleClick = (event) => {
        console.log("Going back to results");
    }

    render() {
        const {classes, elementInfo} = this.props;
        return (
            <React.Fragment>
                <Breadcrumbs aria-label="breadcrumb" className={classes.container}>
                    <Link color="inherit" href="/" onClick={this._handleClick}>
                        Back
                    </Link>
                    {elementInfo.handle && (
                        <Typography color="textPrimary">{elementInfo.handle}</Typography>
                    )}
                    {elementInfo.setID && (
                        <Typography color="textPrimary">{elementInfo.name}</Typography>
                    )}
                </Breadcrumbs>
            </React.Fragment>
        )
    }
}

export default withStyles(useStyles)(NavTrail);