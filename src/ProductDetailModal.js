import React from 'react';
import { Button, Modal, Image, Grid, Message, Header, Icon} from 'semantic-ui-react';
import NumberInput from 'semantic-ui-react-numberinput';

class ProductDetailModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            dimmer: undefined,
            value: '0',
        }
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    changeValue = (newValue) => {
        this.setState({ value: newValue });
    }

    openModal() {
        this.setState({
            open: true
        });
        this.setState({
            dimmer: 'blurring',
        })
    }

    closeModal() {
        this.setState({
            open: false
        })
    }

    render() {
        return (
            <div>
                <Button style={{ width: "100%" }} color='blue' onClick={this.openModal}>
                    See Details and Buy
                </Button>

                <Modal dimmer={this.state.dimmer} open={this.state.open} onClose={this.closeModal}>
                    <Modal.Header>PRODUCT DETAILS</Modal.Header>
                    <Modal.Content>
                        <Grid columns={3} padded divided>
                            <Grid.Row>
                                <Grid.Column width={6}>
                                    <Image src={this.props.imgSrc} fluid />
                                </Grid.Column>
                                <Grid.Column width={10}>
                                    <Header as='h2'>{this.props.productName}</Header>
                                    <Header as='h3' style={{ marginTop: '0px' }}>Rp. {this.props.productPrice.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ".")}</Header>
                                    <p>
                                        {this.props.productDescription}
                                    </p>
                                    <p>
                                        <NumberInput className="numberInput" value={this.state.value} onChange={this.changeValue} />
                                    </p>
                                    <Message info>
                                        <Grid>
                                            <Grid.Row>
                                                <Grid.Column width={5} floated="left">
                                                    <Header as='h3'>SUBTOTAL</Header>
                                                </Grid.Column>
                                                <Grid.Column width={5} floated="right">
                                                <Header as='h3'>Rp. {(this.state.value * this.props.productPrice).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ".")}</Header>
                                                </Grid.Column>
                                            </Grid.Row>
                                        </Grid>
                                    </Message>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>

                    </Modal.Content>
                    <Modal.Actions>
                        <Button.Group>
                            <Button color='green' icon labelPosition='left' onClick={this.closeModal}>
                                <Icon name='money bill alternate outline' />
                                Buy!
                            </Button>
                            <Button.Or />
                            <Button color='yellow' icon labelPosition='right' onClick={this.closeModal}>
                                Add to Cart
                                <Icon name='cart arrow down' />
                            </Button>
                        </Button.Group>
                    </Modal.Actions>
                </Modal>
            </div >
        )
    }
}

export default ProductDetailModal;