import React, { useState, useEffect } from 'react';
import { Grid, Table, Pagination, Header, Input } from 'semantic-ui-react';
import axios from 'axios';
import { useSelector } from "react-redux";
import PaginationBar from "../../components/PaginationBar";

const BASE_URL = "http://localhost:9000";

//Ini harusnya dipisah ke satu berkas sih, cuma udah mepet deadline
const axiosInstance = axios.create({
    baseURL: BASE_URL,
})

function PerProductSellingList(props) {
	const session = useSelector((state) => state.session);
    const ROWS_PER_PAGE = 9;
    const [sellingData, setSellingData] = useState([]);

    const [activePage, setActivePage] = useState(0);
    const [totalRows, setTotalRows] =useState(0);
    const [totalPage,setTotalPage] = useState(0)
    const [searchQuery,setSearchQuery] = useState('');

	useEffect(()=>{
		axiosInstance.get(`/sellings?groupby=product&search-query=${searchQuery}&page=${activePage}&limit=${ROWS_PER_PAGE}`,{
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


	return (
		<Grid padded style={{ height: "100%" }}>
			<Grid.Row style={{ height: "12%" }}>
                <Grid.Column width={5}>
                    <Header as='h1'>Per Product Selling List</Header>
                </Grid.Column>
                <Grid.Column width={11}>
                    <Input style={{width:'100%'}} className='icon' icon='search' placeholder='Search Selling List by Product Name...' onChange={handleSearchBarInput}/>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row style={{ height: '78%', padding: "0px" }}>
            	<Table celled selectable compact>
                    <Table.Header>
                        <Table.Row>
                    		<Table.HeaderCell>Product Id</Table.HeaderCell>
                    		<Table.HeaderCell>Product Name</Table.HeaderCell>
                    		<Table.HeaderCell>Total Product Sold</Table.HeaderCell>
                		</Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {sellingData.map((row,idx)=>{
                			return(
                    			<Table.Row key={idx}>
                        			<Table.Cell>{row.productId}</Table.Cell>
                        			<Table.Cell>{row.productName}</Table.Cell>
                        			<Table.Cell>{row.totalProductSold}</Table.Cell>
                    			</Table.Row>
                			)
            			})}
                    </Table.Body>
                </Table>
            </Grid.Row>
            <Grid.Row style={{ height: '10%', paddingBottom: "0px" }} centered>
                <Grid.Column textAlign='center'>
                    <PaginationBar totalPage={totalPage} handlePageChange={handlePageChange} />
                </Grid.Column>
            </Grid.Row>
		</Grid>
     )
}

export default PerProductSellingList;