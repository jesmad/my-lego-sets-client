import React from "react";

//Material-UI
import { withStyles } from "@material-ui/core/styles";

const useStyles = (theme) => ({
});

class SetPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        return <p>THIS IS THE SETPAGE</p>
    }
}

export default withStyles(useStyles)(SetPage);