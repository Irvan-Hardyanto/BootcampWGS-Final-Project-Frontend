import React, { useState, useEffect } from 'react';
import { Grid, Table, Pagination, Header, Input } from 'semantic-ui-react';
import axios from 'axios';
import useTable from '../../hooks/useTable';
import { useSelector } from "react-redux";

const BASE_URL = "http://localhost:9000";

//Ini harusnya dipisah ke satu berkas sih, cuma udah mepet deadline
const axiosInstance = axios.create({
    baseURL: BASE_URL,
})

function PerProductSellingList(props) {
	const session = useSelector((state) => state.session);
    const ROWS_PER_PAGE = 9;
    const [sellingData, setSellingData] = useState([]);
    const [filteredSellingData, setFilteredSellingData] = useState([]);

    const [activePage, setActivePage] = useState(1);
    const { slice, range }= useTable(filteredSellingData,activePage,ROWS_PER_PAGE)

	useEffect(()=>{
		axiosInstance.get('/sellings?groupby=product',{
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
                return selling.productName.toLowerCase().includes(query);
            }
        })
    }
    const handleSearchBarInput = (event) => {
        setFilteredSellingData(searchSellingList(event.target.value,sellingData));
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
            	<Table celled selectable>
                    <Table.Header>
                        <Table.Row>
                    		<Table.HeaderCell>Product Id</Table.HeaderCell>
                    		<Table.HeaderCell>Product Name</Table.HeaderCell>
                    		<Table.HeaderCell>Total Product Sold</Table.HeaderCell>
                		</Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {slice.map((row,idx)=>{
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
            <Grid.Row style={{ height: '10%', paddingBottom: "0px" }}>
                <Pagination defaultActivePage={1} totalPages={range.length}  onPageChange={handlePageChange} />
            </Grid.Row>
		</Grid>
     )
}

export default PerProductSellingList;