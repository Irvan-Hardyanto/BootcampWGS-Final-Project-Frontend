import React from 'react';
import { Grid } from 'semantic-ui-react';

class Content extends React.Component {
    render(){
        return(
            <Grid.Row style={{height:this.props.height}} columns={this.props.columns}>
                {this.props.children}
            </Grid.Row>      
        )
    }
}

export default Content;