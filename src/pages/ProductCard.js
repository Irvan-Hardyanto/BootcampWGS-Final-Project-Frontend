import React from "react";
import { Card, Image, Label, Grid, Header } from 'semantic-ui-react'
import ProductDetailModal from "./ProductDetailModal";

const ProductCard = (props) => {
    const showProductStock=(stock,unit)=>{
        if(stock>0){
            return <p>Tersisa : {stock} {unit}</p>;
        }
    }

    const showModalButton = (props)=>{
        if(props.stock>0){
            return <ProductDetailModal unit={props.unit} id={props.id} productDescription={props.description} imgSrc={props.imgSrc} productName={props.name} productPrice={props.price} stock={props.stock}></ProductDetailModal>
        }else{
            return <Label color='red' size='large' style={{width:"100%"}}>SOLD OUT!</Label>
        }
    }

    return (
        <Card>
            <Image src={props.imgSrc} wrapped ui={false} />
            <Card.Content key={props.id} style={{ height: '100%' }}>
                {/* Kalau panjang nama produknya lebih dari X karakter-> potong karakternya */}
                <Card.Header style={{ height: "40%", }}>{props.name}</Card.Header>

                <Card.Meta style={{ height: "40%" }}>
                    <Label color='grey' tag as='a'>Rp. {props.price.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ".")}</Label>
                    {showProductStock(props.stock,props.unit)}
                </Card.Meta>
                {showModalButton(props)}
            </Card.Content>
        </Card>
    )
}

export default ProductCard;