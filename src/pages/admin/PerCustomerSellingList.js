import React, { useState, useEffect } from 'react';
import { Grid, Table, Pagination, Header, Input, Modal, Button } from 'semantic-ui-react';
import axios from 'axios';
import useTable from '../../hooks/useTable';
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
     const [filteredSellingData, setFilteredSellingData] = useState([]);

    const [activePage, setActivePage] = useState(1);
    const { slice, range }= useTable(filteredSellingData,activePage,ROWS_PER_PAGE);

    const [open,setOpen]=useState(false);

    useEffect(()=>{
    	axiosInstance.get('/sellings?groupby=customer',{
            headers:{
                'user-id': session.userId,
                'user-role': session.role,
            }
        }).then(response => {
            setSellingData(response.data)
            setFilteredSellingData(response.data)
        }).catch(err => {
            console.log(err);
        })
    },[])

    const handlePageChange = (event, data) => {
        setActivePage(data.activePage);
    }

    const searchSellingList = (query = '', sellings) => {
        query=query.toLowerCase();
        return sellings.filter(selling => { 
            if(query===''){
                return selling
            }else{
                return selling.name.toLowerCase().includes(query);
            }
        })
    }
    const handleSearchBarInput = (event) => {
        setFilteredSellingData(searchSellingList(event.target.value,sellingData));
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
                        {slice.map((row,idx)=>{
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
            <Grid.Row style={{ height: '10%', paddingBottom: "0px" }}>
                <Pagination defaultActivePage={1} totalPages={range.length}  onPageChange={handlePageChange} />
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