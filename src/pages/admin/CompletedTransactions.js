import React, { useState, useEffect } from 'react';
import { Grid, Table, Pagination, Header, Modal, Button, Input, Icon } from 'semantic-ui-react';
import * as format from 'date-format';
import axios from 'axios';
import { useSelector } from "react-redux";
import PaginationBar from "../../components/PaginationBar";

const BASE_URL = "http://localhost:9000";
const DATE_FORMAT = 'dd-MM-yyyy hh:mm:ss';

const axiosInstance = axios.create({
    baseURL: BASE_URL,
})

function CompletedTransactions(props) {
    const ROWS_PER_PAGE = 6;
    const [activePage, setActivePage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('')
    const [totalRows, setTotalRows] =useState(0);
    const [totalPage,setTotalPage] = useState(0)

    const [completedTransactions, setCompletedTransactions] = useState([]);

    const [modalItemsOpen, setModalItemsOpen] = useState(false);
    const [items, setItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const session = useSelector((state) => state.session);

    const getCompletedTransactions = ()=>{
        axiosInstance.get(`/payments?paid=true&search-query=${searchQuery}&page=${activePage}&limit=${ROWS_PER_PAGE}`,{
            headers:{
                'user-id': session.userId,
                'user-role': session.role,
            }
        }).then(response => {
            setCompletedTransactions(response.data.result);
            setTotalPage(response.data.totalPage);
        })
    }
    useEffect(() => {
        getCompletedTransactions()
    }, [activePage,searchQuery])

    const handlePageChange = ({selected}) => {
        setActivePage(selected);
    }
    const handleButtonItemsClicked = (items,nominal) => {
        setItems(JSON.parse(items));
        setTotalPrice(nominal);
        
        setModalItemsOpen(true);
    }

    const handleSearchBarInput = (event) => {
        setSearchQuery(event.target.value)
    }

    return (
        <Grid verticalAlign='middle' padded style={{ height: "100%" }}>
            <Grid.Row style={{ height: "12%" }}>
                <Grid.Column width={5}>
                    <Header as='h1'>Completed Transactions</Header>
                </Grid.Column>
                <Grid.Column width={11}>
                    <Input style={{width:'100%'}} className='icon' icon='search' placeholder='Search Completed Transactions' onChange={handleSearchBarInput} />
                </Grid.Column>
            </Grid.Row>
            <Grid.Row style={{ padding: "0px", height: "78%" }}>
                <Table celled compact>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>No</Table.HeaderCell>
                            <Table.HeaderCell>Transaction Id</Table.HeaderCell>
                            <Table.HeaderCell>Customer Name</Table.HeaderCell>
                            <Table.HeaderCell>Paid At</Table.HeaderCell>
                            <Table.HeaderCell>Items</Table.HeaderCell>
                            <Table.HeaderCell>Nominal</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {completedTransactions.map((row, idx) => {
                            return (
                                <Table.Row key={row.id}>
                                    <Table.Cell>{idx + 1}</Table.Cell>
                                    <Table.Cell>{row.id}</Table.Cell>
                                    <Table.Cell>{row.name}</Table.Cell>
                                    <Table.Cell>{format.asString(DATE_FORMAT, new Date(row.updatedAt))}</Table.Cell>
                                    <Table.Cell><Button primary onClick={() => handleButtonItemsClicked(row.items,row.nominal)}>Show Purchased Items</Button></Table.Cell>
                                    <Table.Cell>{`Rp. ${row.nominal.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ".")}`}</Table.Cell>
                                </Table.Row>
                            )
                        })}
                    </Table.Body>
                </Table>
            </Grid.Row>
            <Grid.Row style={{ height: '10%', paddingBottom: "0px" }} centered>
                <Grid.Column textAlign='center'>
                    <PaginationBar totalPage={totalPage} handlePageChange={handlePageChange}/>
                </Grid.Column>      
            </Grid.Row>
            <Modal size='large' open={modalItemsOpen} onClose={() => setModalItemsOpen(false)}>
                <Modal.Header>Purchased Items</Modal.Header>
                <Modal.Content scrolling>
                    <Table>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>No</Table.HeaderCell>
                                <Table.HeaderCell>Product Id</Table.HeaderCell>
                                <Table.HeaderCell>Product Name</Table.HeaderCell>
                                <Table.HeaderCell>Product Price</Table.HeaderCell>
                                <Table.HeaderCell>Purchase Quantity</Table.HeaderCell>
                                <Table.HeaderCell>Product Unit</Table.HeaderCell>
                                <Table.HeaderCell>SubTotal</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {items.map((item,idx)=>{
                                return(
                                    <Table.Row key={idx}>
                                        <Table.Cell>{idx+1}</Table.Cell>
                                        <Table.Cell>{item.productId}</Table.Cell>
                                        <Table.Cell>{item.productName}</Table.Cell>
                                        <Table.Cell>{`Rp. ${item.productPrice.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ".")}`}</Table.Cell>
                                        <Table.Cell>{item.qty}</Table.Cell>
                                        <Table.Cell>{item.unit}</Table.Cell>
                                        <Table.Cell>{`Rp. ${item.totalPrice.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ".")}`}</Table.Cell>
                                    </Table.Row>
                                )
                            })}
                        </Table.Body>
                        <Table.Footer fullWidth>
                            <Table.Row>
                                <Table.HeaderCell colSpan='6'>
                                    Total Price
                                </Table.HeaderCell>
                                <Table.HeaderCell>
                                    {`Rp. ${totalPrice.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ".")}`}
                                </Table.HeaderCell>
                            </Table.Row>
                        </Table.Footer>
                    </Table>
                </Modal.Content>
                <Modal.Actions>
                    <Button color='green' onClick={() => setModalItemsOpen(false)}>
                        Close
                    </Button>
                </Modal.Actions>
            </Modal>
        </Grid>
    );
}

export default CompletedTransactions;