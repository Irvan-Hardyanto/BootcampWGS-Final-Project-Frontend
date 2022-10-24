import React from 'react';
import { Table } from 'semantic-ui-react';
import * as format from 'date-format';
const DATE_FORMAT = 'dd-MM-yyyy hh:mm:ss';
import useTable from '../../hooks/useTable';

function CompletedTransactions(props) {
    return (
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
                {props.completedTransactions.map((row, idx) => {
                    return (
                        <Table.Row key={row.id}>
                            <Table.Cell>{idx + 1}</Table.Cell>
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
    );
}

export default CompletedTransactions;