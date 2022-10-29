import React, { useState, useEffect } from 'react';
import { Grid, Table, Pagination, Header, Modal, Button, Input } from 'semantic-ui-react';
import * as format from 'date-format';
import axios from 'axios';
import useTable from '../../hooks/useTable';
import { useSelector } from "react-redux";

const BASE_URL = "http://localhost:9000";
const DATE_FORMAT = 'dd-MM-yyyy hh:mm:ss';

const axiosInstance = axios.create({
    baseURL: BASE_URL,
})

function CompletedTransactions(props) {
    const ROWS_PER_PAGE = 5;
    const [activePage, setActivePage] = useState(1);
    const [completedTransactions, setCompletedTransactions] = useState([]);
    const [filteredCompletedTransactions, setFilteredCompletedTransactions] = useState([]);
    const { slice, range } = useTable(filteredCompletedTransactions, activePage, ROWS_PER_PAGE);
    const [modalItemsOpen, setModalItemsOpen] = useState(false);
    const [items, setItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const session = useSelector((state) => state.session);

    useEffect(() => {
        axiosInstance.get('/payments',{
            headers:{
                'user-id': session.userId,
                'user-role': session.role,
            }
        }).then(response => {
            setFilteredCompletedTransactions(response.data.filter(row => row.paid));
            setCompletedTransactions(response.data.filter(row => row.paid));
        })
    }, [])

    const handlePageChange = (event, data) => {
        setActivePage(data.activePage);
    }
    const handleButtonItemsClicked = (items,nominal) => {
        //parse dulu, baru simpan ke state
        //bukan di simpan ke state baru di parse -> error
        setItems(JSON.parse(items));
        setTotalPrice(nominal);
        
        setModalItemsOpen(true);
    }

    const handleSearchBarInput = (event) => {
        const query = event.target.value.toLowerCase();
        setFilteredCompletedTransactions(completedTransactions.filter(transaction=>{
            if(query===''){
                return transaction
            }else{
                return transaction.name.toLowerCase().includes(query) ||
                format.asString(DATE_FORMAT, new Date(transaction.updatedAt)).toString().includes(query)||
                transaction.nominal.toString()==query
            }
        }))
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
                <Table celled>
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
                        {slice.map((row, idx) => {
                            return (
                                <Table.Row key={row.id}>
                                    <Table.Cell>{idx + 1}</Table.Cell>
                                    <Table.Cell>{row.id}</Table.Cell>
                                    <Table.Cell collapsing>{row.name}</Table.Cell>
                                    <Table.Cell collapsing>{format.asString(DATE_FORMAT, new Date(row.updatedAt))}</Table.Cell>
                                    <Table.Cell><Button primary onClick={() => handleButtonItemsClicked(row.items,row.nominal)}>Show Purchased Items</Button></Table.Cell>
                                    <Table.Cell collapsing>{`Rp. ${row.nominal.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ".")}`}</Table.Cell>
                                </Table.Row>
                            )
                        })}
                    </Table.Body>
                </Table>
            </Grid.Row>
            <Grid.Row style={{ height: '10%', paddingBottom: "0px" }}>
                <Pagination defaultActivePage={1} totalPages={range.length} onPageChange={handlePageChange} />
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