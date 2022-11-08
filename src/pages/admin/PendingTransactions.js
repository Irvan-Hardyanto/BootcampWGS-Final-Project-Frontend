import React, { useState, useEffect } from 'react';
import { Table, Modal, Message, Button, Image, Pagination, Grid, Header, Input } from 'semantic-ui-react';
import axios from 'axios';
import qs from 'qs';
import * as format from 'date-format';
import { useSelector } from "react-redux";
import PaginationBar from "../../components/PaginationBar";

const BASE_URL = "http://localhost:9000";
const DATE_FORMAT = 'dd-MM-yyyy hh:mm:ss';

const axiosInstance = axios.create({
    baseURL: BASE_URL,
})

function PendingTransactions(props) {
    //untuk pagination
    const ROWS_PER_PAGE = 7;

    const [pendingTransactions, setPendingTransactions] = useState([]);
    
    const [paymentConfModalOpen, setPaymentConfModalOpen] = useState(false);//modal daftar barang yang dibeli + bukti bayarnya
    const [finalModalOpen, setFinalModalOpen] = useState(false);//modal peringatan sebelum tandai transaksinya udah beres
    
    //untuk searching by nominal, tanggal, user id, dll.
    const [searchQuery, setSearchQuery] = useState('')
    
    //untuk modal konfirmasi transaksi customer
    const [modalItems, setModalItems] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [selectedCustName, setSelectedCustName] = useState(null);
    
    //untuk pagination
    const [activePage, setActivePage] = useState(0);
    const [totalRows, setTotalRows] =useState(0);
    const [totalPage,setTotalPage] = useState(0)
    
    const session = useSelector((state) => state.session);

    const getPendingPayments=()=>{
        axiosInstance.get(`/payments?paid=false&search-query=${searchQuery}&page=${activePage}&limit=${ROWS_PER_PAGE}`, {
            headers: {
                'user-id': session.userId,
                'user-role': session.role,
            }
        }).then(response => {
            setPendingTransactions(response.data.result);
            setActivePage(response.data.page);
            setTotalPage(response.data.totalPage);
        }).catch(err=>{
            console.log(err);
        })
    }

    useEffect(() => {
        getPendingPayments();
        console.log('searchQuery is: '+searchQuery)
    }, [activePage,searchQuery])

    const handlePageChange = ({selected}) => {
        setActivePage(selected);
    }

    //buka modal terakhir (yakin tandai transaksi sudah selesai atau belum)
    const openFinalModal = (event) => {
        setFinalModalOpen(true);
    }

     //tutup modal terakhir (yakin tandai transaksi sudah selesai atau belum)
     //lalu tandai transaksinya sudah selesai. (PUT ke API)
    const closeFinalModal = (paymentId, items) => {
        items.forEach((item) => item.paymentId = paymentId);

        setFinalModalOpen(false);
        closeConfirmationModal();
        //put ke database kalau transaksi nya udah beres
        axiosInstance.put(`/payments?payment-id=${paymentId}&action=finish`, undefined, {
            headers: {
                'user-id': session.userId,
                'user-role': session.role,
            }
        }).then(response => {
            //hapus dari tampilan pengguna
            setPendingTransactions(pendingTransactions.filter(transaction=>{
                return !(transaction.id===paymentId)
            }))
            //POST ke tabel Selling
            axiosInstance.post('/sellings', qs.stringify({ items: items }), {
                headers: { 'content-type': 'application/x-www-form-urlencoded' }
            })

            const formData = new FormData();
            formData.append("timestamp",Date.now());
            formData.append("adminId",parseInt(session.userId));
            formData.append("adminName",session.fullname);
            formData.append("paymentId",parseInt(paymentId));
            formData.append("action",'finish payment');

            return axiosInstance.post('payment-logs',qs.stringify({
                timestamp:Date.now(),
                adminId:parseInt(session.userId),
                adminName:session.fullname,
                paymentId:parseInt(paymentId),
                action:'finish payment'
            }),{
                headers:{
                    'content-type': 'application/x-www-form-urlencoded',
                    'user-id': session.userId,
                    'user-role': session.role,
                }
            })
        }).catch(err => {
            console.log(err);
        })
    }

    //buka modal yang berisi screenshot bukti pembayaran dan data barang-barang yang dibeli
    const openConfirmationModal = (items, paymentId,custName) => {
        setSelectedId(paymentId)
        setModalItems(JSON.parse(items));
        setSelectedCustName(custName);

        setPaymentConfModalOpen(true);
    }

    //tutup modal yang berisi screenshot bukti pembayaran dan data barang-barang yang dibeli
    const closeConfirmationModal = (event) => {
        setPaymentConfModalOpen(false);
    }

    const handleSearchBarInput = (event) => {
        setSearchQuery(event.target.value)
    }

    const countItemsTotalPrice = (items) => {
        if (items.length > 0) {
            let total = 0;
            for (let item of items) {
                total += item.totalPrice;
            }
            return total;
        } else {
            return 0;
        }
    }

    return (
        <Grid verticalAlign='middle' padded style={{ height: "100%" }}>
            <Grid.Row style={{ height: "12%" }}>
                <Grid.Column width={5}>
                    <Header as='h1'>Pending Transactions</Header>
                </Grid.Column>
                <Grid.Column width={11}>
                    <Input style={{ width: '100%' }} className='icon' icon='search' placeholder='Search Pending Transactions by Customer Name or Nominal...' onChange={handleSearchBarInput} />
                </Grid.Column>
            </Grid.Row>
            <Grid.Row style={{ padding: "0px", height: "78%" }}>
                <Table celled compact>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell collapsing>No</Table.HeaderCell>
                            <Table.HeaderCell collapsing>Customer Name</Table.HeaderCell>
                            <Table.HeaderCell collapsing>Created At</Table.HeaderCell>
                            <Table.HeaderCell collapsing>Updated At</Table.HeaderCell>
                            {/* <Table.HeaderCell collapsing>Items</Table.HeaderCell> */}
                            <Table.HeaderCell collapsing>Nominal</Table.HeaderCell>
                            <Table.HeaderCell collapsing>Payment Confirmation</Table.HeaderCell>
                            {/* <Table.HeaderCell collapsing>Action</Table.HeaderCell> */}
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {pendingTransactions.map((row, idx) => {
                            return (
                                <Table.Row key={row.id}>
                                    <Table.Cell collapsing>{((activePage) * ROWS_PER_PAGE) + idx + 1}</Table.Cell>
                                    <Table.Cell collapsing>{row.name}</Table.Cell>
                                    <Table.Cell collapsing>{format.asString(DATE_FORMAT, new Date(row.createdAt))}</Table.Cell>
                                    <Table.Cell collapsing>{format.asString(DATE_FORMAT, new Date(row.updatedAt))}</Table.Cell>
                                    {/* <Table.Cell>{row.items}</Table.Cell> */}
                                    <Table.Cell collapsing>{`Rp. ${row.nominal.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ".")}`}</Table.Cell>
                                    <Table.Cell><Button onClick={() => openConfirmationModal(row.items, parseInt(row.id),row.name)} color='blue'>View Payment Confirmation</Button></Table.Cell>
                                </Table.Row>
                            )
                        })}
                    </Table.Body>
                </Table>
                {/* modal daftar barang yang dibeli */}
                <Modal onClose={closeConfirmationModal} open={paymentConfModalOpen} dimmer='blurring'>
                    <Modal.Header>View Payment Confirmation</Modal.Header>
                    <Modal.Content>
                        <Grid>
                            <Grid.Row>
                                <Grid.Column width={5}>
                                    <Image src={BASE_URL + "/payments/image/" + selectedId}></Image>
                                </Grid.Column>
                                <Grid.Column width={11}>
                                    <Header as="h5">{`Customer Name: ${selectedCustName}`}</Header>
                                    <Table celled compact>
                                        <Table.Header>
                                            <Table.Row>
                                                <Table.HeaderCell>Product Id</Table.HeaderCell>
                                                <Table.HeaderCell>Product Name</Table.HeaderCell>
                                                <Table.HeaderCell>Product Price</Table.HeaderCell>
                                                <Table.HeaderCell>Qty</Table.HeaderCell>
                                                <Table.HeaderCell>Subtotal</Table.HeaderCell>
                                            </Table.Row>
                                        </Table.Header>
                                        <Table.Body>
                                            {modalItems.map((item, idx) => {
                                                return (
                                                    <Table.Row key={item.productId}>
                                                        <Table.Cell>{item.productId}</Table.Cell>
                                                        <Table.Cell>{item.productName}</Table.Cell>
                                                        <Table.Cell>{`Rp. ${item.productPrice.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ".")}`}</Table.Cell>
                                                        <Table.Cell>{item.qty}</Table.Cell>
                                                        <Table.Cell>{`Rp. ${item.totalPrice.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ".")}`}</Table.Cell>
                                                    </Table.Row>
                                                )
                                            })}
                                        </Table.Body>
                                    </Table>
                                    <Header as='h3'>{`TOTAL PRICE: Rp. ${countItemsTotalPrice(modalItems).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ".")}`}</Header>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color='red'>Challenge Payment</Button>
                        <Button color='green' onClick={openFinalModal}>Confirm Payment</Button>
                    </Modal.Actions>

                    {/* Modal konfirmasi terakhir */}
                    <Modal size="tiny" dimmer='blurring' open={finalModalOpen} onClose={()=>setFinalModalOpen(false)}>
                        <Modal.Content>
                            <Message icon='warning sign'
                                header='Are You Sure To Confirm This Transaction as Done?'
                                content="After clicking 'Yes' button, you CANNOT undo payment status!"
                                warning>
                            </Message>
                        </Modal.Content>
                        <Modal.Actions>
                            <Button negative >
                                No
                            </Button>
                            <Button onClick={() => closeFinalModal(selectedId, modalItems)} positive >
                                Yes
                            </Button>
                        </Modal.Actions>
                    </Modal>
                </Modal>
            </Grid.Row>
            <Grid.Row style={{ height: '10%', paddingBottom: "0px" }} centered>
                <Grid.Column textAlign='center'>
                    <PaginationBar totalPage={totalPage} handlePageChange={handlePageChange}/>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
}

export default PendingTransactions;