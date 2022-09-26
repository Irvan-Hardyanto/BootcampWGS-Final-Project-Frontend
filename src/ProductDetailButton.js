import React from 'react';
import { Button, Icon } from 'semantic-ui-react';

class ProductDetailButton extends React.Component {
    render() {
        return (
            <div>
                <Button style={{ width: "100%" }} color='blue'>See More Details</Button>
            </div>
        )
    }
}

export default ProductDetailButton;