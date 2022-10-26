import React, { useState, useEffect } from 'react';
import { Grid, Table, Pagination, Header, Search } from 'semantic-ui-react';
import * as format from 'date-format';
import axios from 'axios';
import useTable from '../../hooks/useTable';

const BASE_URL = "http://localhost:9000";
const DATE_FORMAT = 'dd-MM-yyyy hh:mm:ss';

//Ini harusnya dipisah ke satu berkas sih, cuma udah mepet deadline
const axiosInstance = axios.create({
    baseURL: BASE_URL,
})

function SellingList(props) {
    const ROWS_PER_PAGE = 9;
    const [sellingData, setSellingData] = useState([]);//'data'  itu sellingData
    const [activePage, setActivePage] = useState(1);
    const [title,setTitle] = useState('');
    //slice itu data yang udah dipisah pisah
    //range array yang berisi jumlah 'row' di setiap halaman
    const { slice, range }= useTable(sellingData,activePage,ROWS_PER_PAGE)

    useEffect(() => {
        setSellingData([]);
        if (props.groupby === "none") {
            setTitle('All Selling List');
            axiosInstance.get('/sellings').then(response => {
                setSellingData(response.data)
            }).catch(err => {
                console.log(err);
            })
        }else if(props.groupby === "product"){
            setTitle('Per Product Selling List');
            axiosInstance.get('/sellings?groupby=product').then(response => {
                setSellingData(response.data)
            }).catch(err => {
                console.log(err);
            })

        }else if(props.groupby === "customer"){
            setTitle('Per Customer Selling List');
            axiosInstance.get('/sellings?groupby=customer').then(response => {
                setSellingData(response.data)
            }).catch(err => {
                console.log(err);
            })
        }
    }, [props.groupby]);

    const handlePageChange = (event, data) => {
        setActivePage(data.activePage);
    }

    const getTableHeader = () => {
        if (props.groupby === "none") {
            return (
                <Table.Row>
                    <Table.HeaderCell>Payment Id</Table.HeaderCell>
                    <Table.HeaderCell>Product Id</Table.HeaderCell>
                    <Table.HeaderCell>Product Name</Table.HeaderCell>
                    <Table.HeaderCell>Product Price</Table.HeaderCell>
                    <Table.HeaderCell>Purchase Qty</Table.HeaderCell>
                    <Table.HeaderCell>Total Price</Table.HeaderCell>
                    <Table.HeaderCell>Bought At</Table.HeaderCell>
                </Table.Row>
            )
        }else if(props.groupby === "product"){
            return (
                <Table.Row>
                    <Table.HeaderCell>Product Id</Table.HeaderCell>
                    <Table.HeaderCell>Product Name</Table.HeaderCell>
                    <Table.HeaderCell>Total Product Sold</Table.HeaderCell>
                </Table.Row>
            )
        }else if(props.groupby === "customer"){
            return(
                <Table.Row>
                    <Table.HeaderCell>Customer Id</Table.HeaderCell>
                    <Table.HeaderCell>Customer Name</Table.HeaderCell>
                    <Table.HeaderCell>Total Products Purchased</Table.HeaderCell>
                </Table.Row>
            )
        }
    }

    //hati-hati, kalau state 'sellingData' berubah ->dirender ulang
    const getTableBody = (data) => {
        if (props.groupby === "none") {
            return data.map((row, idx) => {
                return (
                    <Table.Row key={row.id}>
                        <Table.Cell>{row.paymentId}</Table.Cell>
                        <Table.Cell>{row.productId}</Table.Cell>
                        <Table.Cell>{row.productName}</Table.Cell>
                        <Table.Cell>{row.productPrice}</Table.Cell>
                        <Table.Cell>{row.quantity}</Table.Cell>
                        <Table.Cell>{row.totalPrice}</Table.Cell>
                        <Table.Cell>{format.asString(DATE_FORMAT, new Date(row.createdAt))}</Table.Cell>
                    </Table.Row>
                )
            })
        }else if(props.groupby === "product"){
            return data.map((row,idx)=>{
                return(
                    <Table.Row key={row.productId}>
                        <Table.Cell>{row.productId}</Table.Cell>
                        <Table.Cell>{row.productName}</Table.Cell>
                        <Table.Cell>{row.totalProductSold}</Table.Cell>
                    </Table.Row>
                )
            })
            
        }else if(props.groupby === "customer"){
            return data.map((row,idx)=>{
                return(
                    <Table.Row key={idx}>
                        <Table.Cell>{row.customerId}</Table.Cell>
                        <Table.Cell>{row.name}</Table.Cell>
                        <Table.Cell>{row.totBuy}</Table.Cell>
                    </Table.Row>
                )
            })
        }
    }

    return (
        <Grid padded style={{ height: "100%" }}>
            <Grid.Row style={{ height: "12%" }}>
                <Grid.Column width={8}>
                    <Header as='h1'>{title}</Header>
                </Grid.Column>
                <Grid.Column width={8}>
                    <Search></Search>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row style={{ height: '78%', padding: "0px" }}>
                <Table>
                    <Table.Header>
                        {getTableHeader()}
                    </Table.Header>
                    <Table.Body>
                        {getTableBody(slice)}
                    </Table.Body>
                </Table>
            </Grid.Row>
            <Grid.Row style={{ height: '10%', paddingBottom: "0px" }}>
                <Pagination defaultActivePage={1} totalPages={range.length}  onPageChange={handlePageChange} />
            </Grid.Row>
        </Grid>
    );
}

export default SellingList;