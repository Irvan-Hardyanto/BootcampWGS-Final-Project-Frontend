import React from 'react';
import MainLayout from './MainLayout';
import CustomHeader from './CustomHeader';
import ProductCard from './ProductCard';
import { Card } from 'semantic-ui-react';

import axios from 'axios';
//pengennya pake .env, tapi undefined terus.
const BASE_URL = "http://localhost:9000";

class ProductListPage extends React.Component {
    constructor(props) {
        super(props);
        
        this.state={
            products:[]
        }
        this.getRndInteger = this.getRndInteger.bind(this);
        this.generateDummyProductData = this.generateDummyProductData.bind(this);
        
        const axiosInstance = axios.create({
            baseURL: BASE_URL,
        })

        axiosInstance.get('/customer/productlist').then(response=>{
            // console.log(response);
            this.setState({products: response.data});
        }).catch(error=>{
            alert(error);
        })
    }

    render() {
        return (
            <MainLayout columns={3}>
                <CustomHeader placeholder="Type to search a product..." height="25vh" imgSrc="./images/logo-pake-padding.png">
                </CustomHeader>
                {/* <Content maxHeight="75vh" columns={4} overflow="auto"> */}
                <Card.Group centered itemsPerRow={6}>
                    {this.state.products.map((product, idx) => {
                        return <ProductCard name={product.name} imgSrc={product.image} price={product.price} description={product.description}></ProductCard>;
                    })}
                </Card.Group>
                {/* </Content> */}
            </MainLayout>
        )
    }
}

export default ProductListPage;