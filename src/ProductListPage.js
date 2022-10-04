import React from 'react';
import { faker } from '@faker-js/faker';
import MainLayout from './MainLayout';
import CustomHeader from './CustomHeader';
import ProductCard from './ProductCard';
import { Card } from 'semantic-ui-react';

class ProductListPage extends React.Component {
    constructor(props) {
        super(props);
        this.getRndInteger = this.getRndInteger.bind(this);
        this.generateDummyProductData = this.generateDummyProductData.bind(this);
    }

    // dikutip dari laman w3schools.com
    // https://www.w3schools.com/js/js_random.asp
    getRndInteger(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    generateDummyProductData = (productNum) => {
        let products = [];
        for (let i = 1; i <= productNum; i++) {
            products.push({
                name: faker.commerce.productName(),
                description: faker.commerce.productDescription(),
                price: this.getRndInteger(10000, 100000),
                stock: this.getRndInteger(1, 100),
                unit: '',
                image: faker.image.food(this.getRndInteger(600,1000), this.getRndInteger(600,1000), false),
            });
        }
        return products;
    }
    render() {
        return (
            <MainLayout columns={3}>
                <CustomHeader placeholder="Type to search a product..." height="25vh" imgSrc="./images/logo-pake-padding.png">
                </CustomHeader>
                {/* <Content maxHeight="75vh" columns={4} overflow="auto"> */}
                <Card.Group centered itemsPerRow={6}>
                    {this.generateDummyProductData(13).map((product, idx) => {
                        return <ProductCard name={product.name} imgSrc={product.image} price={product.price} description={product.description}></ProductCard>;
                    })}
                </Card.Group>
                {/* </Content> */}
            </MainLayout>
        )
    }
}

export default ProductListPage;