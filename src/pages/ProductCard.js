import React from "react";
import { Card, Image, Label, Grid, Header } from 'semantic-ui-react'
import ProductDetailModal from "./ProductDetailModal";

class ProductCard extends React.Component {
    render() {
        return (
            <Card>
                <Image src={this.props.imgSrc} wrapped ui={false} />
                <Card.Content key={this.props.id} style={{height:'100%'}}>
                    {/* Kalau panjang nama produknya lebih dari X karakter-> potong karakternya */}
                    <Card.Header style={{height:"40%",}}>{this.props.name}</Card.Header>

                    <Card.Meta style={{height:"40%"}}>
                        <Label color='grey' tag as='a'>Rp. {this.props.price.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ".")}</Label>
                        <p>Tersisa : {this.props.stock} {this.props.unit}</p>
                    </Card.Meta>

                    <ProductDetailModal unit={this.props.unit} id={this.props.id} productDescription={this.props.description} imgSrc={this.props.imgSrc} productName={this.props.name} productPrice={this.props.price}></ProductDetailModal>
                </Card.Content>
            </Card>
        )
    }
}

export default ProductCard;