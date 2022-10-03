import React from 'react';
import CustomHeader from './CustomHeader';
import { Container, Grid, Header, Table, Image, Button } from 'semantic-ui-react';

class SellingListPage extends React.Component {
    render() {
        return (
            <Container style={{ maxHeight: "100%", backgroundColor: 'white' }}>
                <Grid verticalAlign='middle' padded>
                    <CustomHeader height="20vh" placeholder="Search a Product to see its selling" imgSrc="../images/logo-pake-padding.png"></CustomHeader>
                    <Grid.Row style={{ padding: "0px", height: "80vh" }}>
                        <Grid.Column>
                            <Header as='h1'>SELLING LIST</Header>
                            <Container style={{ maxHeight: "70vh", overflow: "Auto" }}>
                                <Table celled striped selectable>
                                    <Table.Header>
                                        <Table.Row>
                                            <Table.HeaderCell>Selling ID</Table.HeaderCell>{/*Primary key */}
                                            <Table.HeaderCell>Purchase Date</Table.HeaderCell>
                                            <Table.HeaderCell>Customer ID</Table.HeaderCell>
                                            {/* <Table.HeaderCell>Customer Name</Table.HeaderCell> */}
                                            <Table.HeaderCell>Product ID</Table.HeaderCell>{/*Primary key */}
                                            <Table.HeaderCell>Product Name</Table.HeaderCell>
                                            <Table.HeaderCell>Qty</Table.HeaderCell>
                                            <Table.HeaderCell>Product Price</Table.HeaderCell>
                                            <Table.HeaderCell>Nominal</Table.HeaderCell>
                                        </Table.Row>
                                    </Table.Header>
                                    <Table.Body>
                                        {/* Nantinya, data nya dapet dari tabel yg mencatat penjualan */}
                                        {this.props.sellingList.map((row, idx) => {
                                            return (
                                                <Table.Row key={row.id}>
                                                    <Table.Cell>{row.id}</Table.Cell>
                                                    <Table.Cell selectable><a href="/">{row.purchaseDate}</a></Table.Cell>
                                                    <Table.Cell selectable><a href="/">{row.customerId}</a></Table.Cell>
                                                    {/* <Table.Cell>{row.customerName}</Table.Cell> */}
                                                    <Table.Cell selectable><a href="/">{row.productId}</a></Table.Cell>
                                                    <Table.Cell selectable><a href="/">{row.productName}</a></Table.Cell>
                                                    <Table.Cell>{row.qty}</Table.Cell>
                                                    <Table.Cell>{row.productPrice}</Table.Cell>
                                                    <Table.Cell>{row.nominal}</Table.Cell>
                                                </Table.Row>
                                            )

                                        })}
                                    </Table.Body>
                                </Table>
                            </Container>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Container>
        )
    }
}

export default SellingListPage;