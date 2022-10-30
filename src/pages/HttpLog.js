import React, { useState, useEffect } from 'react';
import { Grid, Header, Table, Pagination, Label, Button, Icon, Input } from 'semantic-ui-react';
import * as format from 'date-format';
import axios from 'axios';
import useTable from '../hooks/useTable';
import { CSVLink } from "react-csv";
import _ from 'lodash';
import { useSelector } from "react-redux";

const BASE_URL = "http://localhost:9000";
const DATE_FORMAT = 'dd-MM-yyyy hh:mm:ss';
const LOG_FIELDS = ['logId', 'userId', 'timestamp', 'role', 'sourceIP', 'method', 'url', 'statusCode', 'responseTime', 'totalTime'];

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

//kalau mau lebih rapih lagi, filter log nya di backend, pake WHERE method LIKE ... OR status LIKE ...
function HttpLog(props) {
    const ROWS_PER_PAGE = 8;
    const [activePage, setActivePage] = useState(1);
    const [log, setLog] = useState([]);//data log yang apa adanya dari database
    const [filteredLog,setFilteredLog] = useState([]);//data log yang sudah di-filter berdasarkan kueri tertentu
    const { slice, range } = useTable(filteredLog, activePage, ROWS_PER_PAGE);
    const [csvData, setCsvData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('')
    const session = useSelector((state) => state.session);

    const formatLogToCSV = (logs) => {
        let csvData = [];
        csvData.push(LOG_FIELDS);
        console.log('csv Data header is: '+csvData);
        //header csv nya

        //isi dari csv nya
        for (let log of logs) {
            csvData.push(_.values(log));
        }
        return csvData;
    }

    useEffect(() => {
        axiosInstance.get('/logs',{
            headers:{
                'user-id': session.userId,
                'user-role': session.role,
            }
        }).then(response => {
            setCsvData(formatLogToCSV(response.data));
            setLog(response.data);
            setFilteredLog(response.data);
        }).catch(err => {
            console.log(err);
        })
    }, [])

    const handlePageChange = (event, data) => {
        setActivePage(data.activePage);
    }
    const handleSearchBarInput = (event) => {
        // console.log('search bar value is changed...')
        // setSearchQuery(event.target.value);
        setFilteredLog(searchLog(event.target.value,log));
    }

    const searchLog = (query = '', logs) => {
        
        return logs.filter(log => { 
            query=query.toLowerCase();
 
            if(query===''){
                return log
            }else{
                // search by method/date/statuscode/path/url???
                
                return log.url.toLowerCase().includes(query)||
                log.method.toLowerCase().includes(query)||
                log.statusCode.toString().toLowerCase().includes(query) ||
                format.asString(DATE_FORMAT, new Date(log.timestamp)).toString().includes(query)
  
            }
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
                    <CSVLink filename="http-logs" data={csvData}>
                        <Button icon labelPosition='left' primary>
                            <Icon name='download' />
                            Download as .csv File
                        </Button>
                    </CSVLink>

                </Grid.Column>
            </Grid.Row>
            <Grid.Row style={{ padding: "0px", height: "78%" }}>
                <Table celled>
                    <Table.Header>
                        <Table.Row textAlign='center'>
                            <Table.HeaderCell>No.</Table.HeaderCell>
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
                        {searchLog(searchQuery,slice).map((row, idx) => {
                            return (
                                <Table.Row key={row.logId} textAlign='center'>
                                    <Table.Cell>{((activePage - 1) * ROWS_PER_PAGE) + idx + 1}</Table.Cell>
                                    <Table.Cell>{format.asString(DATE_FORMAT, new Date(row.timestamp))}</Table.Cell>
                                    <Table.Cell>{row.userId}</Table.Cell>
                                    <Table.Cell>{row.role}</Table.Cell>
                                    <Table.Cell>{row.sourceIP}</Table.Cell>
                                    <Table.Cell>{row.url}</Table.Cell>
                                    <Table.Cell>{formatMethod(row.method)}</Table.Cell>
                                    <Table.Cell>{formatStatusCode(row.statusCode)}</Table.Cell>
                                    <Table.Cell>{row.responseTime}</Table.Cell>
                                    <Table.Cell>{row.totalTime}</Table.Cell>
                                </Table.Row>
                            )
                        })}
                    </Table.Body>
                </Table>
            </Grid.Row>
            <Grid.Row style={{ height: '10%', paddingBottom: "0px" }}>
                <Pagination defaultActivePage={1} totalPages={range.length} onPageChange={handlePageChange} />
            </Grid.Row>
        </Grid>
    );
}

export default HttpLog;