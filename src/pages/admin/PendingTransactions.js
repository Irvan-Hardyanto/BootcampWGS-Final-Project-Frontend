import React, { useState, useEffect } from 'react';
import { Table, Modal, Message, Button, Image, Pagination } from 'semantic-ui-react';
import axios from 'axios';
import qs from 'qs';
import * as format from 'date-format';
import useTable from '../../hooks/useTable';

const BASE_URL = "http://localhost:9000";
const DATE_FORMAT = 'dd-MM-yyyy hh:mm:ss';

const axiosInstance = axios.create({
    baseURL: BASE_URL,
})

function PendingTransactions(props) {
    const ROWS_PER_PAGE = 6;
    const [paymentConfModalOpen, setPaymentConfModalOpen] = useState(false);
    const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
    const [activePage, setActivePage] = useState(1);
    const { slice, range } = useTable(props.pendingTransactions, activePage, ROWS_PER_PAGE);

    const handlePageChange = (event, data) => {
        setActivePage(data.activePage);
    }

    const openFinalModal = (event) => {
        setConfirmationModalOpen(true);
    }

    const closeFinalModal = (paymentId, items) => {
        // console.log('paymentId is: '+paymentId);
        console.log('items is: ' + items);
        items = JSON.parse(items);
        items.forEach((item) => item.paymentId = paymentId);

        setConfirmationModalOpen(false);
        //put ke database kalau transaksi nya udah beres
        axiosInstance.put('/payments/' + paymentId).then(response => {
            //POST ke tabel Selling
            return axiosInstance.post('/sellings', qs.stringify({ items: items }), {
                headers: { 'content-type': 'application/x-www-form-urlencoded' }
            })
        }).then(response => {
            console.log(response);
        }).catch(err => {
            console.log(err);
        })
    }

    const openConfirmationModal = (event) => {
        setPaymentConfModalOpen(true);
    }

    const closeConfirmationModal = (event) => {
        setPaymentConfModalOpen(false);
    }

    return (
        <div>
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
                    {slice.map((row, idx) => {
                        return (
                            <Table.Row key={row.id}>
                                <Table.Cell collapsing>{((activePage-1)*ROWS_PER_PAGE)+ idx+1}</Table.Cell>
                                <Table.Cell collapsing>{row.id}</Table.Cell>
                                <Table.Cell collapsing>{row.userId}</Table.Cell>
                                <Table.Cell collapsing>{format.asString(DATE_FORMAT, new Date(row.createdAt))}</Table.Cell>
                                <Table.Cell collapsing>{format.asString(DATE_FORMAT, new Date(row.updatedAt))}</Table.Cell>
                                {/* <Table.Cell>{row.items}</Table.Cell> */}
                                <Table.Cell collapsing>{`Rp. ${row.nominal.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ".")}`}</Table.Cell>
                                <Table.Cell><Button onClick={openConfirmationModal} color='blue'>View Payment Confirmation</Button></Table.Cell>
                                {/* <Table.Cell><Button color='green'>Confirm Payment</Button></Table.Cell> */}
                                <Modal onClose={closeConfirmationModal} open={paymentConfModalOpen} dimmer='blurring'>
                                    <Modal.Header>View Payment Confirmation</Modal.Header>
                                    <Modal.Content>
                                        <Image src={BASE_URL + "/payments/image/" + row.id}></Image>
                                    </Modal.Content>
                                    <Modal.Actions>
                                        <Button color='red'>Challenge Payment</Button>
                                        <Button color='green' onClick={openFinalModal}>Confirm Payment</Button>
                                    </Modal.Actions>
                                    <Modal size="tiny" dimmer='blurring' open={confirmationModalOpen} onClose={closeFinalModal}>
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
                                            <Button onClick={() => closeFinalModal(row.id, row.items)} positive >
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
            <Pagination defaultActivePage={1} totalPages={range.length} onPageChange={handlePageChange} />
        </div>
    );
}

export default PendingTransactions;