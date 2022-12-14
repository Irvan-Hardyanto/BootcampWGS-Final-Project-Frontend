import React, { useState, useEffect } from 'react';
import { Grid, Table, Pagination, Header, Search, Input } from 'semantic-ui-react';
import * as format from 'date-format';
import axios from 'axios';
import { useSelector } from "react-redux";
import PaginationBar from "../../components/PaginationBar";

const BASE_URL = "http://localhost:9000";
const DATE_FORMAT = 'dd-MM-yyyy hh:mm:ss';

//Ini harusnya dipisah ke satu berkas sih, cuma udah mepet deadline
const axiosInstance = axios.create({
    baseURL: BASE_URL,
})

function SellingList(props) {
    const session = useSelector((state) => state.session);
    const ROWS_PER_PAGE = 9;
    const [sellingData, setSellingData] = useState([]);//'data'  itu sellingData
    const [activePage, setActivePage] = useState(0);
    const [totalRows, setTotalRows] =useState(0);
    const [totalPage,setTotalPage] = useState(0)
    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        axiosInstance.get(`/sellings?orderby=createdAt&order=DESC&search-query=${searchQuery}&page=${activePage}&limit=${ROWS_PER_PAGE}`,{
            headers:{
                'user-id': session.userId,
                'user-role': session.role,
            }
        }).then(response => {
            setSellingData(response.data.result);
            setTotalRows(response.data.totalRows);
            setActivePage(parseInt(response.data.page));
            setTotalPage(parseInt(response.data.totalPage));
        }).catch(err => {
            console.log(err);
        })
        
    }, [searchQuery,activePage]);

    const handlePageChange = ({selected}) => {
        setActivePage(selected);
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
        setSearchQuery(event.target.value.toLowerCase());
    }

    return (
        <Grid padded style={{ height: "100%" }}>
            <Grid.Row style={{ height: "12%" }}>
                <Grid.Column width={5}>
                    <Header as='h1'>All Selling List</Header>
                </Grid.Column>
                <Grid.Column width={11}>
                    <Input style={{width:'100%'}} className='icon' icon='search' placeholder='Search Selling List by Product Name...' onChange={handleSearchBarInput}/>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row style={{ height: '78%', padding: "0px" }}>
                <Table celled selectable compact>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Payment Id</Table.HeaderCell>
                            <Table.HeaderCell>Product Name</Table.HeaderCell>
                            <Table.HeaderCell>Product Price</Table.HeaderCell>
                            <Table.HeaderCell>Purchase Qty</Table.HeaderCell>
                            <Table.HeaderCell>Total Price</Table.HeaderCell>
                            <Table.HeaderCell>Purchased At</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {sellingData.map((row, idx) => {
                            return (
                                <Table.Row key={idx}>
                                    <Table.Cell>{row.paymentId}</Table.Cell>
                                    <Table.Cell>{row.productName}</Table.Cell>
                                    <Table.Cell>Rp. {row.productPrice.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ".")}</Table.Cell>
                                    <Table.Cell>{row.quantity}</Table.Cell>
                                    <Table.Cell>Rp. {row.totalPrice.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ".")}</Table.Cell>
                                    <Table.Cell>{format.asString(DATE_FORMAT, new Date(row.createdAt))}</Table.Cell>
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
        </Grid>
    );
}

export default SellingList;