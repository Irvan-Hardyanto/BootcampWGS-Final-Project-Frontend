import React, { useState, useEffect } from 'react';
import { Grid, Header, Table, Image, Button, Search, Pagination, Icon, Modal, Message } from 'semantic-ui-react';
import { useSelector } from "react-redux";
import axios from 'axios';
import useTable from '../../hooks/useTable';
import { faker } from '@faker-js/faker';

const BASE_URL = "http://localhost:9000";

const axiosInstance = axios.create({
    baseURL: BASE_URL,
})

function AdminList(props) {
    const ROWS_PER_PAGE = 6;
    const [admins, setAdmins] = useState([]);
    const [activePage, setActivePage] = useState(1);
    const { slice, range } = useTable(admins, activePage, ROWS_PER_PAGE);
    const session = useSelector((state) => state.session);

    useEffect(() => {
        //tambahkan request header berupa user id dan role nya
        let reqHeader = {}
        if (session.id) {
            reqHeader.headers = {
                'user-id': session.id,
                'user-role': session.role
            }
        }
        axiosInstance.get('/users?role=2', reqHeader).then(response => {
            setAdmins(response.data);
        }).catch(err => {
            console.log(err);
        })
    }, []);

    const handlePageChange = (event, data) => {
        setActivePage(data.activePage);
    }

    return (
        <Grid verticalAlign='middle' padded style={{ height: "100%" }}>
            <Grid.Row style={{ height: "12%" }}>
                <Grid.Column width={8}>
                    <Header as='h1'>Admin List</Header>
                </Grid.Column>
                <Grid.Column width={8}>
                    <Search></Search>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row style={{ padding: "0px", height: "78%" }}>
                <Table celled striped selectable>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>ID</Table.HeaderCell>
                            <Table.HeaderCell>Photo</Table.HeaderCell>
                            <Table.HeaderCell>Name</Table.HeaderCell>
                            <Table.HeaderCell>Email</Table.HeaderCell>
                            <Table.HeaderCell>Mobile</Table.HeaderCell>
                            <Table.HeaderCell>Username</Table.HeaderCell>
                            <Table.HeaderCell>Action</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {slice.map((admin, idx) => {
                            return (
                                <Table.Row key={admin.id}>
                                    <Table.Cell> {admin.id}</Table.Cell>
                                    <Table.Cell> <Image src={faker.image.avatar()} avatar /></Table.Cell>
                                    <Table.Cell> {admin.name}</Table.Cell>
                                    <Table.Cell>{!admin.email ? <Icon name='question'></Icon> : admin.email}</Table.Cell>
                                    <Table.Cell>{!admin.mobile ? <Icon name='question'></Icon> : admin.mobile}</Table.Cell>
                                    <Table.Cell>{admin.userName}</Table.Cell>
                                    {/* <Table.Cell>{customer.password}</Table.Cell> */}
                                    <Table.Cell>
                                        <Button.Group>
                                            <Button primary>De-elect to Customer</Button>
                                            <Button.Or />
                                            <Button negative>Delete</Button>
                                        </Button.Group>
                                    </Table.Cell>
                                </Table.Row>
                            )
                        })}
                    </Table.Body>
                </Table>
            </Grid.Row>
            <Grid.Row style={{ height: '10%', paddingBottom: "0px" }}>
                <Pagination defaultActivePage={1} totalPages={range.length} onPageChange={handlePageChange} />
            </Grid.Row>
        </Grid>
    );
}

export default AdminList;