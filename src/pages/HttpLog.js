import React, { useState, useEffect } from 'react';
import { Grid, Header, Table, Pagination, Label, Button, Icon, Input } from 'semantic-ui-react';
import * as format from 'date-format';
import axios from 'axios';
import _ from 'lodash';
import { useSelector } from "react-redux";
import PaginationBar from "../components/PaginationBar";

const BASE_URL = "http://localhost:9000";
const DATE_FORMAT = 'dd-MM-yyyy hh:mm:ss';

const axiosInstance = axios.create({
    baseURL: BASE_URL,
})

const formatMethod = (method) => {
    if (method === 'GET') {
        return <Label color='green'>{method}</Label>
    } else if (method === 'POST') {
        return <Label color='blue'>{method}</Label>
    } else if (method === 'PUT') {
        return <Label color='orange'>{method}</Label>
    } else if (method === 'DELETE') {
        return <Label color='red'>{method}</Label>
    } else if (method === 'OPTIONS') {
        return <Label color='brown'>{method}</Label>
    }
}

const formatStatusCode = (statusCode) => {
    if (statusCode >= 200 && statusCode <= 299) {
        return <span style={{ color: 'green', fontWeight: 'bold' }}>{statusCode}</span>
    } else if (statusCode >= 300 && statusCode <= 399) {
        return <span style={{ color: 'orange', fontWeight: 'bold' }}>{statusCode}</span>
    } else if (statusCode >= 400 && statusCode <= 499) {
        return <span style={{ color: 'red', fontWeight: 'bold' }}>{statusCode}</span>
    } else if (statusCode >= 500 && statusCode <= 599) {
        return <span style={{ color: 'darkred', fontWeight: 'bold' }}>{statusCode}</span>
    }
}

function HttpLog(props) {
    const ROWS_PER_PAGE = 8;
    const [activePage, setActivePage] = useState(0);
    const [log, setLog] = useState([]);//data log yang apa adanya dari database
    const [totalRows, setTotalRows] =useState(0);
    const [totalPage,setTotalPage] = useState(0)
    // const [csvData, setCsvData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('')
    const session = useSelector((state) => state.session);

    const getLogs=()=>{
        axiosInstance.get(`/logs?search_query=${searchQuery}&page=${activePage}&limit=${ROWS_PER_PAGE}`).then(response=>{
            setLog(response.data.result);
            setActivePage(parseInt(response.data.page));
            setTotalPage(parseInt(response.data.totalPage))
        })
    }

    useEffect(()=>{
        getLogs();
    },[activePage,searchQuery])

    const handlePageChange = ({selected}) => {
        setActivePage(selected);
    }
    const handleSearchBarInput = (event) => {
        setSearchQuery((event.target.value).toLowerCase());
    }

    //https://stackoverflow.com/a/57788656
    const handleBtnDownloadClicked = ()=>{
        axiosInstance.get('/logs/download',{
            headers:{
                'user-id': session.userId,
                'user-role': session.role,
            }
        }).then(response=>{
            var hiddenElement = document.createElement('a');
            hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(response.data);
            hiddenElement.target = '_blank';
            hiddenElement.download = 'output.csv';
            hiddenElement.click();
        })
    }

    return (
        <Grid verticalAlign='middle' padded style={{ height: "100%" }}>
            <Grid.Row style={{ height: "12%" }}>
                <Grid.Column width={3}>
                    <Header as='h1'>HTTP Logs</Header>
                </Grid.Column>
                <Grid.Column width={9}>
                    <Input style={{width:'100%'}} className='icon' icon='search' placeholder='Search by method or url or status code or timestamp...' onChange={handleSearchBarInput} />
                </Grid.Column>
                <Grid.Column width={4}>
                    <Button icon labelPosition='left' primary onClick={handleBtnDownloadClicked}>
                        <Icon name='download' />
                            Download as .csv File
                    </Button>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row style={{ padding: "0px", height: "78%" }}>
                <Table celled compact>
                    <Table.Header>
                        <Table.Row textAlign='center'>
                            <Table.HeaderCell>Timestamp</Table.HeaderCell>
                            <Table.HeaderCell>User ID</Table.HeaderCell>
                            <Table.HeaderCell>Role</Table.HeaderCell>
                            <Table.HeaderCell>Source IP</Table.HeaderCell>
                            <Table.HeaderCell>Path</Table.HeaderCell>
                            <Table.HeaderCell>Method</Table.HeaderCell>
                            <Table.HeaderCell>Status Code</Table.HeaderCell>
                            <Table.HeaderCell>Response Time (ms)</Table.HeaderCell>
                            <Table.HeaderCell>Total Time (ms)</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {log.map((row, idx) => {
                            return (
                                <Table.Row key={row.logId} textAlign='center'>
                                    <Table.Cell width={3}>{format.asString(DATE_FORMAT, new Date(row.timestamp))}</Table.Cell>
                                    <Table.Cell width={1}>{row.userId}</Table.Cell>
                                    <Table.Cell width={1}>{row.role}</Table.Cell>
                                    <Table.Cell>{row.sourceIP}</Table.Cell>
                                    <Table.Cell width={3}>{row.url}</Table.Cell>
                                    <Table.Cell>{formatMethod(row.method)}</Table.Cell>
                                    <Table.Cell width={1}>{formatStatusCode(row.statusCode)}</Table.Cell>
                                    <Table.Cell width={1}>{row.responseTime}</Table.Cell>
                                    <Table.Cell width={1}>{row.totalTime}</Table.Cell>
                                </Table.Row>
                            )
                        })}
                    </Table.Body>
                </Table>
            </Grid.Row>
            <Grid.Row style={{ height: '10%', paddingBottom: "0px" }} centered>
                <Grid.Column textAlign='center'>
                    <PaginationBar totalPage={totalPage} handlePageChange={handlePageChange}/>
                </Grid.Column>    
            </Grid.Row>
        </Grid>
    );
}

export default HttpLog;