import React, { useState, useEffect } from 'react';
import { Grid, Tab, Table, Menu, Label, Button, Modal, Image, Message } from 'semantic-ui-react';
import axios from 'axios';
import * as format from 'date-format';
import qs from 'qs';

const BASE_URL = "http://localhost:9000";
const DATE_FORMAT = 'dd-MM-yyyy hh:mm:ss';

const axiosInstance = axios.create({
    baseURL: BASE_URL,
})

const panes = (props) => {

    return [
        {
            menuItem: (
                <Menu.Item key='messages'>
                    Pending Transactions <Label>{props.pendingTransactions.length}</Label>
                </Menu.Item>
            ),
            render: () => {
                return (
                    <Tab.Pane>
                        <Table celled>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell collapsing>No</Table.HeaderCell>
                                    <Table.HeaderCell collapsing>Transaction Id</Table.HeaderCell>
                                    <Table.HeaderCell collapsing>User Id</Table.HeaderCell>
                                    <Table.HeaderCell collapsing>Created At</Table.HeaderCell>
                                    <Table.HeaderCell collapsing>Updated At</Table.HeaderCell>
                                    {/* <Table.HeaderCell collapsing>Items</Table.HeaderCell> */}
                                    <Table.HeaderCell collapsing>Nominal</Table.HeaderCell>
                                    <Table.HeaderCell collapsing>Payment Confirmation</Table.HeaderCell>
                                    {/* <Table.HeaderCell collapsing>Action</Table.HeaderCell> */}
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {props.pendingTransactions.map((row, idx) => {
                                    return (
                                        <Table.Row key={row.id}>
                                            <Table.Cell collapsing>{idx+1}</Table.Cell>
                                            <Table.Cell collapsing>{row.id}</Table.Cell>
                                            <Table.Cell collapsing>{row.userId}</Table.Cell>
                                            <Table.Cell collapsing>{format.asString(DATE_FORMAT, new Date(row.createdAt))}</Table.Cell>
                                            <Table.Cell collapsing>{format.asString(DATE_FORMAT, new Date(row.updatedAt))}</Table.Cell>
                                            {/* <Table.Cell>{row.items}</Table.Cell> */}
                                            <Table.Cell collapsing>{`Rp. ${row.nominal.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ".")}`}</Table.Cell>
                                            <Table.Cell><Button onClick={props.openConfirmationModal} color='blue'>View Payment Confirmation</Button></Table.Cell>
                                            {/* <Table.Cell><Button color='green'>Confirm Payment</Button></Table.Cell> */}
                                            <Modal onClose={props.closeConfirmationModal} open={props.paymentConfModalOpen} dimmer='blurring'>
                                                <Modal.Header>View Payment Confirmation</Modal.Header>
                                                <Modal.Content>
                                                    <Image src={BASE_URL + "/payments/image/" + row.id}></Image>
                                                </Modal.Content>
                                                <Modal.Actions>
                                                    <Button color='red'>Challenge Payment</Button>
                                                    <Button color='green' onClick={props.openFinalModal}>Confirm Payment</Button>
                                                </Modal.Actions>
                                                <Modal size="tiny" dimmer='blurring' open={props.confirmationModalOpen} onClose={props.closeFinalModal}>
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
                                                        <Button onClick={()=>props.closeFinalModal(row.id)} positive >
                                                            Yes
                                                        </Button>
                                                    </Modal.Actions>
                                                </Modal>
                                            </Modal>
                                        </Table.Row>
                                    )
                                })}
                            </Table.Body>
                        </Table>
                    </Tab.Pane>
                )
            }
        },
        {
            menuItem: 'Completed Transactions',
            render: () => {
                return (
                    <Tab.Pane>
                        <Table celled>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>No</Table.HeaderCell>
                                    <Table.HeaderCell>Payment Id</Table.HeaderCell>
                                    <Table.HeaderCell>User Id</Table.HeaderCell>
                                    <Table.HeaderCell>Paid At</Table.HeaderCell>
                                    <Table.HeaderCell>Items</Table.HeaderCell>
                                    <Table.HeaderCell>Nominal</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {props.completedTransactions.map((row,idx)=>{
                                    return(
                                        <Table.Row key={row.id}>
                                            <Table.Cell>{idx+1}</Table.Cell>
                                            <Table.Cell>{row.id}</Table.Cell>
                                            <Table.Cell collapsing>{row.userId}</Table.Cell>
                                            <Table.Cell collapsing>{format.asString(DATE_FORMAT, new Date(row.updatedAt))}</Table.Cell>
                                            <Table.Cell>{row.items}</Table.Cell>
                                            <Table.Cell collapsing>{`Rp. ${row.nominal.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ".")}`}</Table.Cell>
                                        </Table.Row>
                                    )
                                })}
                            </Table.Body>
                        </Table>
                    </Tab.Pane>
                )
            }
        }
    ];
}


function AdminDashboard(props) {
    const [pendingTransactions, setPendingTransactions] = useState([]);
    const [completedTransactions, setCompletedTransactions] = useState([]);
    const [paymentConfModalOpen, setPaymentConfModalOpen] = useState(false);
    const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);

    //get dari API sekali saja di awal
    //tapi kedepannya harus dipikirin gimana cara nya ketika ada transaksi baru,
    //ada row baru yang di  insert ke database, 
    //otomatis nge get ke api => tampilan nya otomatis berubah
    useEffect(() => {
        axiosInstance.get('/payments').then(response => {
            setPendingTransactions(response.data.filter(row => !row.paid));
            setCompletedTransactions(response.data.filter(row => row.paid));
        })
    }, [])

    const openFinalModal = (event) => {
        setConfirmationModalOpen(true);
    }

    const closeFinalModal = (paymentId) => {
        console.log('paymentId is: '+paymentId);
        setConfirmationModalOpen(false);
        //put ke database kalau transaksi nya udah beres
        //terus kurangin jml stok barang yg dibeli
        axiosInstance.put('/payments/'+paymentId).then(response=>{
            console.log(response);
        }).catch(err=>{
            console.log(err);
        })
    }

    const openConfirmationModal = (event) => {
        setPaymentConfModalOpen(true);
    }

    const closeConfirmationModal = (event) => {
        setPaymentConfModalOpen(false);
    }
    const paneProps = {
        pendingTransactions,
        paymentConfModalOpen,
        completedTransactions,
        openConfirmationModal,
        closeConfirmationModal,
        openFinalModal,
        closeFinalModal,
        confirmationModalOpen
    }
    return (
        <Grid padded style={{ height: "100%" }}>
            <Grid.Row>
                <Grid.Column>

                </Grid.Column>
            </Grid.Row>
            <Grid.Row>
                <Grid.Column>
                    <Tab panes={panes(paneProps)} />
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
}

export default AdminDashboard;