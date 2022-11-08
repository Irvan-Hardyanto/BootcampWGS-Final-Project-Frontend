import React, { useState, useEffect } from 'react';
import { Table, Grid, Header, Input } from 'semantic-ui-react';
import PaginationBar from "../../components/PaginationBar";
import { useSelector } from "react-redux";
import axios from 'axios';
/* global BigInt */
const BASE_URL = "http://localhost:9000";
const DATE_FORMAT = 'dd-MM-yyyy hh:mm:ss';

const axiosInstance = axios.create({
    baseURL: BASE_URL,
})

function PaymentConfirmationHistory(props) {
	const ROWS_PER_PAGE = 9;
	const [searchQuery,setSearchQuery]=useState('');
	const [activePage, setActivePage] = useState(0);
    const [totalRows, setTotalRows] =useState(0);
    const [totalPage,setTotalPage] = useState(0);

    const [paymentConfirmationHistory,setPaymentConfirmationHistory]=useState([]);
    
    const session = useSelector((state) => state.session);

    useEffect(()=>{
    	axiosInstance.get(`/payment-logs?search-query=${searchQuery}&page=${activePage}&limit=${ROWS_PER_PAGE}`,{
    		headers: {
                'user-id': session.userId,
                'user-role': session.role,
            }
    	}).then(response=>{
    		setPaymentConfirmationHistory(response.data.result);
    		setActivePage(response.data.page);
    		setTotalRows(response.data.totalRows);
            setTotalPage(response.data.totalPage);
    	})
    },[activePage,searchQuery])

	const handleSearchBarInput = (event) => {
        setSearchQuery(event.target.value)
    }

    const handlePageChange = ({selected}) => {
        setActivePage(selected);
    }

    const formatDate=(date)=>{
    	// console.log('typof date is : '+typeof date)
    	const dateObj = new Date(Number(BigInt(date)));
    	return `${dateObj.getDate()}-${dateObj.getMonth()}-${dateObj.getFullYear()} ${dateObj.getHours()}:${dateObj.getMinutes()}:${dateObj.getSeconds()}`
    }
	return(
		<Grid verticalAlign='middle' padded style={{ height: "100%" }}>
			<Grid.Row style={{ height: "12%" }}>
				<Grid.Column width={7}>
                    <Header as='h1'>Payment Confirmation History</Header>
                </Grid.Column>
                <Grid.Column width={9}>
                    <Input style={{ width: '100%' }} className='icon' icon='search' placeholder='Search Payment Confirmation History...' onChange={handleSearchBarInput} />
                </Grid.Column>
			</Grid.Row>
			<Grid.Row style={{ padding: "0px", height: "78%" }}>
				<Table celled compact>
					<Table.Header>
						<Table.Row>
							<Table.HeaderCell>No</Table.HeaderCell>
							<Table.HeaderCell>Timestamp</Table.HeaderCell>
							<Table.HeaderCell>Admin Name</Table.HeaderCell>
							<Table.HeaderCell>Payment Id</Table.HeaderCell>
							<Table.HeaderCell>Action</Table.HeaderCell>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{paymentConfirmationHistory.map((row,idx)=>{
							return(
								<Table.Row>
									<Table.Cell>{idx}</Table.Cell>
									<Table.Cell>{formatDate(row.timestamp)}</Table.Cell>
									<Table.Cell>{row.adminName}</Table.Cell>
									<Table.Cell>{row.paymentId}</Table.Cell>
									<Table.Cell>{row.action}</Table.Cell>
								</Table.Row>
							)
						})}
					</Table.Body>
				</Table>
			</Grid.Row>
			<Grid.Row style={{ height: '10%', paddingBottom: "0px" }} centered>
				<PaginationBar totalPage={totalPage} handlePageChange={handlePageChange}/>
			</Grid.Row>
		</Grid>
	)
}

export default PaymentConfirmationHistory;