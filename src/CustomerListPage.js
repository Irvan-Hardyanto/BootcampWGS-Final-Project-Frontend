import React from 'react';
import CustomHeader from './CustomHeader';
import { Container, Grid, Header, Table, Image, Button } from 'semantic-ui-react';

class CustomerListPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            customers: props.customers,//array of customer objects
        }
    }

    render() {
        return (
            <Container style={{ maxHeight: "100%", backgroundColor: 'white' }}>
                <Grid verticalAlign='middle' padded>
                    <CustomHeader height="20vh" placeholder="Search an customer.." imgSrc="../images/logo-pake-padding.png"></CustomHeader>
                    <Grid.Row style={{ padding: "0px",height:"80vh"}}>
                        <Grid.Column>
                            <Header as='h1'>CUSTOMER LIST</Header>
                            <Container style={{ maxHeight: "70vh", overflow: "Auto" }}>
                                <Table celled striped selectable>
                                    <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell>ID</Table.HeaderCell>
                                        <Table.HeaderCell>Photo</Table.HeaderCell>
                                        <Table.HeaderCell>Name</Table.HeaderCell>
                                        <Table.HeaderCell>Email</Table.HeaderCell>
                                        <Table.HeaderCell>Mobile</Table.HeaderCell>
                                        <Table.HeaderCell>Username</Table.HeaderCell>
                                        <Table.HeaderCell>Password</Table.HeaderCell>
                                        <Table.HeaderCell>Action</Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>

                                <Table.Body>
                                    {this.state.customers.map((customer, idx) => {
                                        return (
                                            <Table.Row key={customer.id}>
                                                <Table.Cell> {customer.id}</Table.Cell>
                                                <Table.Cell> <Image src={customer.photo} avatar /></Table.Cell>
                                                <Table.Cell> {customer.name}</Table.Cell>
                                                <Table.Cell>{customer.email}</Table.Cell>
                                                <Table.Cell>{customer.mobile}</Table.Cell>
                                                <Table.Cell>{customer.userName}</Table.Cell>
                                                <Table.Cell>{customer.password}</Table.Cell>
                                                <Table.Cell>
                                                    <Button.Group>
                                                        <Button positive>Edit</Button>
                                                        <Button.Or />
                                                        <Button negative>Delete</Button>
                                                    </Button.Group>
                                                </Table.Cell>
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

export default CustomerListPage;