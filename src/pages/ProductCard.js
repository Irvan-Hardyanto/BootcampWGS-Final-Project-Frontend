import React from "react";
import { Card, Image, Label } from 'semantic-ui-react'
import ProductDetailModal from "./ProductDetailModal";

class ProductCard extends React.Component {
    render() {
        return (
            <Card>
                <Image src={this.props.imgSrc} wrapped ui={false} />
                <Card.Content key={this.props.id}>
                    <Card.Header>{this.props.name}</Card.Header>
                    <Card.Meta>
                        <Label color='grey' tag as='a'>Rp. {this.props.price.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ".")}</Label>
                        <p>Tersisa : {this.props.stock} {this.props.unit}</p>
                    </Card.Meta>
                    <Card.Description>
                        
                    </Card.Description>
                    <ProductDetailModal unit={this.props.unit} id={this.props.id} productDescription={this.props.description} imgSrc={this.props.imgSrc} productName={this.props.name} productPrice={this.props.price}></ProductDetailModal>
                </Card.Content>
            </Card>
        )
    }
}

export default ProductCard;