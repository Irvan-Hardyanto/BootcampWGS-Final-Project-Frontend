import React, { useState} from "react";
import { Container, Grid, Header, Message, Image, List, Button } from 'semantic-ui-react';
import { useLocation, Navigate } from 'react-router-dom';
import { FileUploader } from "react-drag-drop-files";
import { useSelector } from "react-redux";
import axios from "axios";

const BASE_URL = "http://localhost:9000";
const MAX_IMAGE_SIZE = 1;//dalam satuan MB
const axiosInstance = axios.create({
    baseURL: BASE_URL,
})

///checkout sama payment sebenernya bisa ngambil dari 'store' nya cart
function PaymentPage(props) {
    const session = useSelector((state) => state.session)
    const [paymentCompleted,setPaymentCompleted]=useState(false);
    const [loading,setLoading]=useState(false);
    const order = useLocation().state;
    // console.log(order);
    const countTotalPrice=(order)=>{
        let totalPrice = 0;
        order.forEach((product)=>{
            totalPrice +=product.quantity*product.price;
        })
        return totalPrice;
    }

    const fileTypes = ["JPG", "PNG"];
    const [paymentConfirmation, setPaymentConfirmation] = useState(null);
    
    const formatOrder= (order)=>{
        let items = [];
        for(let i =0;i < order.length;i++){
            items.push({
                userId: session.userId,//denormalisasi, buat cari tau user beli apa aja (supaya gak perlu join).
                productId:order[i].id,//denormalisasi juga
                productName:order[i].name,//denormalisasi juga
                productPrice:order[i].price,//denormalisasi juga
                unit: order[i].unit,//denormalisasi juga
                qty:order[i].quantity,//denormalisasi juga
                totalPrice:order[i].quantity*order[i].price
            })
        }
        return items;
    }
    const handleChange = (file) => {
      setPaymentConfirmation(file);
    };

    const handleTypeError = (event)=>{
        alert('Invalid file format! Accepted formats are: '+fileTypes);
    }

    const handleSizeError = (event)=>{
        alert(`Picture size too large! maximum image size is ${MAX_IMAGE_SIZE} MB!`);
    }
    const handleSubmit = (event)=>{
        if(!paymentConfirmation){
            //tampilkan pesan error
            alert('Please upload payment confirmation image!')
        }else if(order.length===0){
            alert('No items to pay!')
        }else{
            setLoading(true);
            const formData = new FormData();

            formData.append("userId",session.userId);
            formData.append("items",JSON.stringify(formatOrder(order)));
            formData.append("nominal",countTotalPrice(order));
            formData.append("paymentConfirmation",paymentConfirmation);
            console.log('appending form data done!');
            console.log('formData, in JSON format are:'+JSON.stringify(formData));
            for (const [key, value] of Object.entries(formData)) {
                console.log(`${key}: ${value}`);
              }
            axiosInstance.post('/payments',formData, {
                headers: {
                    'user-id': session.userId,
                    'user-role': session.role,
                    'content-type': 'multipart/form-data; boundary=-----rick' 
                }
            }).then(response=>{
                setLoading(false);
                setPaymentCompleted(true);//untuk redirect ke halaman detail produk
                //kasih konfirmasi kalau pembayaran berhasil.
            }).catch(err=>{
                setLoading(false);
                console.log(err);
            })
        }
    }
    if(paymentCompleted){
        return <Navigate to='/products'/>
    }
    return (
        <Container style={{ backgroundColor: "white", height: "100%" }}>
            <Grid padded style={{ height: "100%" }}>
                <Grid.Row style={{ height: "20%", padding: "0px" }}>
                    <Grid.Column>
                        <Header as="h1" style={{ marginTop: "0.3em" }}>PAYMENT</Header>
                        <Message info>
                            <Message.Header>One Last Step!</Message.Header>
                            Please scan QR code below for payment,
                        </Message>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row centered style={{ height: "60%" }}>
                    <Grid.Column verticalAlign='middle' width={10} textAlign='center'>
                        <Header as='h1'>ORDER DETAILS</Header>
                        <List style={{ maxHeight: "15em", overflowY: "auto", overflowX: "hidden" }} divided>
                            {order.map((product, idx) => {
                                return (
                                    <List.Item key={product.id}>
                                        <List.Content>
                                            <Grid columns={2}>
                                                <Grid.Row>
                                                    <Grid.Column textAlign='left' width={10}>
                                                        <Header size='medium'>{product.name}</Header>
                                                        <Header sub style={{ fontSize: "0.9em" }}>{`${product.quantity}  \u00A0 ${product.unit}`}</Header>
                                                    </Grid.Column>
                                                    <Grid.Column width={6} textAlign='right'>
                                                        <Header as='h2'>{`Rp. ${(parseInt(product.quantity) * parseInt(product.price)).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ".")}`}</Header>
                                                    </Grid.Column>
                                                </Grid.Row>
                                            </Grid>
                                        </List.Content>
                                    </List.Item>
                                )
                            })}
                        </List>
                        <Message>
                            <Grid>
                                <Grid.Row>
                                    <Grid.Column width={10} textAlign='left'>
                                        <Header size='large'>TOTAL PRICE</Header>
                                    </Grid.Column>
                                    <Grid.Column width={6} textAlign='right'>
                                        <Header size='large'>{`Rp.  ${countTotalPrice(order).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ".")}`}</Header>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </Message>
                    </Grid.Column>
                    <Grid.Column textAlign='center' width={5} style={{ margin: "auto", height: '100%' }}>
                        <Grid style={{ height: '100%' }}>
                            <Grid.Row style={{ height: '80%' }}>
                                <Grid.Column style={{ maxHeight: '100%' }}>
                                    <Container style={{ maxHeight: '100%' }}>
                                        <Image size="medium" src={"../images/qr.jpg"}></Image>
                                    </Container>
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row style={{ height: '20%' }}>
                                <Grid.Column textAlign='center'>
                                    <FileUploader onTypeError={handleTypeError} onSizeError={handleSizeError} label="Upload your payment confirmation here" handleChange={handleChange} name="paymentConfirmation" maxSize={MAX_IMAGE_SIZE} types={fileTypes} />
                                    <br/>
                                    <Button onClick={handleSubmit} color='blue' loading={loading}>Confirm Payment</Button>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row style={{ height: "20%" }}>
                    <Grid.Column textAlign='center'>
                        <Header size='medium'>Available Payment Methods</Header>
                        <Grid>
                            <Grid.Row centered columns={1} style={{ padding: "0px" }}>
                                <Grid.Column verticalAlign='middle' width={3} textAlign='center'>
                                    <Image fluid src="../images/gopay.png" />
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Container>
    );
}

export default PaymentPage;