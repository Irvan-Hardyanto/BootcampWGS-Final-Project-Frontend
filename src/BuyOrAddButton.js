import React from 'react';
import { Button, Icon } from 'semantic-ui-react';

class BuyOrAddButton extends React.Component {
    render() {
        return (
            <div>
                <Button.Group style={{ width: "100%" }}>
                    <Button color='green' icon labelPosition='left'>
                    <Icon name='money bill alternate outline' />
                    Buy!
                    </Button>
                    <Button.Or />
                    <Button color='yellow' icon labelPosition='right'>
                    <Icon name='right plus square' />
                    Add to cart
                    </Button>
                </Button.Group>
            </div>
        )
    }
}

export default BuyOrAddButton; 