import React from "react";
import { Card, Image, Label } from 'semantic-ui-react'
import ProductDetailModal from "./ProductDetailModal";

class ProductCard extends React.Component {
    render() {
        return (
            // <div className='col-3' style={{height: "100%"}}>
            //     <div className="card" style={{height: "100%"}}>
            //         <img src={this.props.imgSrc} className="card-img-top" alt="..." />
            //         <div className="card-body" >
            //             <h5 className="card-title">{this.props.name}</h5>
            //             <p className="card-text">{this.props.desc}</p>
            //             <h6 className="card-subtitle mb-2 text-muted">Rp {this.props.price.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ".")}</h6>
            //             <ProductDetailButton></ProductDetailButton>
            //             <ProductDetailModal></ProductDetailModal>
            //         </div>
            //     </div>
            // </div>
            <Card>
                <Image src={this.props.imgSrc} wrapped ui={false} />
                <Card.Content>
                    <Card.Header>{this.props.name}</Card.Header>
                    <Card.Meta>
                        <Label color='grey' tag as='a'>Rp. {this.props.price.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ".")}</Label>
                    </Card.Meta>
                    <Card.Description>
                        
                    </Card.Description>
                    <ProductDetailModal productDescription={this.props.description} imgSrc={this.props.imgSrc} productName={this.props.name} productPrice={this.props.price}></ProductDetailModal>
                </Card.Content>
            </Card>
        )
    }
}

export default ProductCard;