import React, { useState, useEffect } from 'react';
import { Grid, Table, Pagination, Header, Input, Modal, Button } from 'semantic-ui-react';
import axios from 'axios';
import PaginationBar from "../../components/PaginationBar";
import { useSelector } from "react-redux";

const BASE_URL = "http://localhost:9000";

//Ini harusnya dipisah ke satu berkas sih, cuma udah mepet deadline
const axiosInstance = axios.create({
    baseURL: BASE_URL,
})

function PerCustomerSellingList(props) {
	const session = useSelector((state) => state.session);
    const ROWS_PER_PAGE = 9;
    const [sellingData, setSellingData] = useState([]);
    const [customerPurchaseData, setCustomerPurchaseData] = useState([]);

    const [activePage, setActivePage] = useState(0);
    const [totalRows, setTotalRows] =useState(0);
    const [totalPage,setTotalPage] = useState(0)
    const [searchQuery,setSearchQuery] = useState('');

    const [open,setOpen]=useState(false);

    useEffect(()=>{
    	axiosInstance.get(`/sellings?groupby=customer&search-query=${searchQuery}&page=${activePage}&limit=${ROWS_PER_PAGE}`,{
            headers:{
                'user-id': session.userId,
                'user-role': session.role,
            }
        }).then(response => {
            setSellingData(response.data.result);
            setActivePage(response.data.page);
            setTotalPage(response.data.totalPage);
            setTotalRows(response.data.totalRows);
        }).catch(err => {
            console.log(err);
        })
    },[activePage,searchQuery])

    const handlePageChange = ({selected}) => {
        setActivePage(selected);
    }
    const handleSearchBarInput = (event) => {
        setSearchQuery(event.target.value.toLowerCase());
    }
    const getCustomerPurchasedProducts = (customerId)=>{
        setOpen(true);
        axiosInstance.get(`/sellings?userid=${customerId}`,{
            headers:{
                'user-id': session.userId,
                'user-role': session.role,
            }
        }).then(response => {
            setCustomerPurchaseData(response.data);
        }).catch(err => {
            console.log(err);
        })
    }

    return(
    	<Grid padded style={{ height: "100%" }}>
			<Grid.Row style={{ height: "12%" }}>
                <Grid.Column width={5}>
                    <Header as='h1'>Per Customer Selling List</Header>
                </Grid.Column>
                <Grid.Column width={11}>
                    <Input style={{width:'100%'}} className='icon' icon='search' placeholder='Search By Customer Name...' onChange={handleSearchBarInput}/>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row style={{ height: '78%', padding: "0px" }}>
            	<Table celled selectable>
                    <Table.Header>
                        <Table.Row>
                    		<Table.HeaderCell>Customer Id</Table.HeaderCell>
                    		<Table.HeaderCell>Customer Name</Table.HeaderCell>
                    		<Table.HeaderCell>Total Products Purchased</Table.HeaderCell>
                    		<Table.HeaderCell>Total Paid</Table.HeaderCell>
                		</Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {sellingData.map((row,idx)=>{
                			return(
                    			<Table.Row key={idx} onClick={()=>getCustomerPurchasedProducts(row.customerId)}>
                        			<Table.Cell>{row.customerId}</Table.Cell>
                        			<Table.Cell>{row.name}</Table.Cell>
                        			<Table.Cell>{row.totBuy}</Table.Cell>
                        			<Table.Cell>Rp. {row.totPaid.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ".")}</Table.Cell>
                    			</Table.Row>
                			)
            			})}
                    </Table.Body>
                </Table>
            </Grid.Row>
            <Grid.Row style={{ height: '10%', paddingBottom: "0px" }} centered>
                <Grid.Column textAlign='center'>
                    <PaginationBar totalPage={totalPage}  handlePageChange={handlePageChange} />
                </Grid.Column>
            </Grid.Row>
            <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      >
      <Modal.Header>Products Purchased by This Customer</Modal.Header>
      <Modal.Content>
        <Table>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>Product Name</Table.HeaderCell>
                    <Table.HeaderCell>Purchased Quantity</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {customerPurchaseData.map((row,idx)=>{
                    return(
                        <Table.Row>
                            <Table.Cell>{row.productName}</Table.Cell>
                            <Table.Cell>{row.totPurchased}</Table.Cell>
                        </Table.Row>
                    )
                })}
            </Table.Body>
        </Table>
      </Modal.Content>
      <Modal.Actions>
        <Button color='green' onClick={() => setOpen(false)}>
          Close
        </Button>
      </Modal.Actions>
    </Modal>
		</Grid>
    )
}

export default PerCustomerSellingList;