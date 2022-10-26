import React from 'react';
import { Grid } from 'semantic-ui-react';

class MainLayout extends React.Component {
    render() {
        return (
            <Grid verticalAlign='middle' style={{height:"100%"}} columns={this.props.colNum} padded>
                {this.props.children}
            </Grid>
        );
    }
}

export default MainLayout;