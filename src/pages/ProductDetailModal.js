import React, { useState } from 'react';
import { Button, Modal, Image, Grid, Message, Header, Icon } from 'semantic-ui-react';
import NumberInput from 'semantic-ui-react-numberinput';
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { addProduct } from "../reducers/CartSlice.js";

const ProductDetailModal = (props) => {
    const [open, setOpen] = useState(false);
    const [quantity, setQuantity] = useState('1');
    const dispatch = useDispatch();
    const session = useSelector((state) => state.session);
    const navigate = useNavigate();
    
    const changePurchaseQuantity = (newQuantity) => {
        // this.setState({ quantity: newQuantity });
        setQuantity(newQuantity);
    }

    const openModal = () => {
        setOpen(true);
    }

    //tutup modalnya dan tambahkan ke cart
    const closeModal = () => {
        console.log('session.userId is: '+session.userId);
        if(!session.userId){
            navigate('/login')
            // return <Navigate to='/login' state={{msg:"You Must Login As Customer First!"}}></Navigate>
        }else{
            console.log('dispatching to cart'); 
            dispatch(addProduct({
                product: {
                    id: parseInt(props.id),
                    image: props.imgSrc,
                    name: props.productName,
                    price: parseInt(props.productPrice),
                    quantity: parseInt(quantity),
                    unit: props.unit,
                    checked: false,
                }
            }));
            setOpen(false);
        }
    }

    return (
        <div>
            <Button style={{ width: "100%" }} color='blue' onClick={openModal}>
                See Details and Buy
            </Button>

            <Modal dimmer={'blurring'} open={open} onClose={closeModal}>
                <Modal.Header>PRODUCT DETAILS</Modal.Header>
                <Modal.Content>
                    <Grid columns={3} padded divided>
                        <Grid.Row key={props.id}>
                            <Grid.Column width={6}>
                                <Image src={props.imgSrc} fluid />
                            </Grid.Column>
                            <Grid.Column width={10}>
                                <Header as='h2'>{props.productName}</Header>
                                <Header as='h3' style={{ marginTop: '0px' }}>Rp. {props.productPrice.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ".")}</Header>
                                <p>
                                    {props.productDescription}
                                </p>
                                <div style={{ display: "flex", alignItems: "center" }}>
                                    <NumberInput className="numberInput" value={quantity} onChange={changePurchaseQuantity} /> &nbsp;&nbsp;&nbsp;{props.unit}
                                </div>

                                <Message info>
                                    <Grid>
                                        <Grid.Row>
                                            <Grid.Column width={5} floated="left">
                                                <Header as='h3'>SUBTOTAL</Header>
                                            </Grid.Column>
                                            <Grid.Column width={5} floated="right">
                                                <Header as='h3'>Rp. {(quantity * props.productPrice).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ".")}</Header>
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
                        <Link to='/checkout' state={{//awalnya state nya itu array doang.
                            products: [
                                {
                                    id: props.id,
                                    image: props.imgSrc,
                                    name: props.productName,
                                    price: props.productPrice,
                                    quantity: parseInt(quantity),
                                    unit: props.unit
                                }
                            ],
                            prevPage: 'product_detail_modal'
                        }

                        }>
                            <Button color='green' icon labelPosition='left' onClick={()=>setOpen(false)}>
                                <Icon name='money bill alternate outline' />
                                Buy!
                            </Button>
                        </Link>
                        <Button.Or />

                        <Button color='yellow' icon labelPosition='right' onClick={closeModal}>
                            Add to Cart
                            <Icon name='cart arrow down' />
                        </Button>
                    </Button.Group>
                </Modal.Actions>
            </Modal>
        </div >
    )
}

export default ProductDetailModal;