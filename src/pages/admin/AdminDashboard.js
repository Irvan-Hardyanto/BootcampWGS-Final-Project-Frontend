import React, { useState, useEffect } from 'react';
import { Grid, Menu, Header, Label} from 'semantic-ui-react';
import axios from 'axios';
import PendingTransactions from './PendingTransactions';
import CompletedTransactions from './CompletedTransactions';
import ProductList from './ProductList';
import SellingList from './SellingList';

const BASE_URL = "http://localhost:9000";

const axiosInstance = axios.create({
    baseURL: BASE_URL,
})

function AdminDashboard(props) {
    const [pendingTransactions, setPendingTransactions] = useState([]);
    const [completedTransactions, setCompletedTransactions] = useState([]);
    const [clickedMenu, setClickedMenu] = useState('');

    //get dari API sekali saja di awal
    //tapi kedepannya harus dipikirin gimana cara nya ketika ada transaksi baru,
    //ada row baru yang di  insert ke database, 
    //otomatis nge get ke api => tampilan nya otomatis berubah
    useEffect(() => {
        axiosInstance.get('/payments').then(response => {
            setPendingTransactions(response.data.filter(row => !row.paid));
            setCompletedTransactions(response.data.filter(row => row.paid));
        })
    }, [])

    const showMainContent = () => {
        console.log('type of clickedMenu is: '+(typeof clickedMenu))
        if (clickedMenu === 'pending_transactions') {
            return <PendingTransactions
                pendingTransactions={pendingTransactions} setPendingTransactions={setPendingTransactions}
            />
        }else if(clickedMenu === 'completed_transactions'){
            return(
                <CompletedTransactions
                    completedTransactions={completedTransactions}
                />
            )
        }else if(clickedMenu === 'products'){
            return <ProductList/>;
        }else if(clickedMenu.includes("sellinglist")){
            if(clickedMenu==='sellinglist/all'){
                return <SellingList groupby='none'></SellingList>
            }
        }
    }

    return (
        <Grid padded style={{ height: "100%" }}>
            <Grid.Row style={{ height: "10%" }}>
                <Grid.Column>
                    <Header as='h1'>Admin Dashboard</Header>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row style={{ height: "90%" }}>
                <Grid.Column width={3} style={{ height: "100%" }}>
                    <Menu style={{ height: "100%", width: "100%" }} pointing vertical>
                        <Menu.Item>
                            <Menu.Header>Inventory</Menu.Header>
                            <Menu.Menu>
                                <Menu.Item name="Product list" onClick={() => setClickedMenu('products')}/>
                            </Menu.Menu>
                        </Menu.Item>
                        <Menu.Item>
                            <Menu.Header>Selling List</Menu.Header>
                            <Menu.Menu>
                                <Menu.Item name="Show All" onClick={()=>setClickedMenu('sellinglist/all')}/>
                                <Menu.Item name="Daily (Coming Soon!)" onClick={()=>setClickedMenu('sellinglist/daily')}/>
                                <Menu.Item name="Weekly (Coming Soon!)" onClick={()=>setClickedMenu('sellinglist/weekly')}/>
                                <Menu.Item name="Monthly (Coming Soon!)" onClick={()=>setClickedMenu('sellinglist/monthly')}/>
                                <Menu.Item name="By Product" onClick={()=>setClickedMenu('sellinglist/product')}/>
                                <Menu.Item name="By Customer" onClick={()=>setClickedMenu('sellinglist/product')}/>
                            </Menu.Menu>
                        </Menu.Item>
                        <Menu.Item>
                            <Menu.Header>Users List</Menu.Header>
                            <Menu.Menu>
                                <Menu.Item name="Customers" />
                                <Menu.Item name="Admins" />
                            </Menu.Menu>
                        </Menu.Item>
                        <Menu.Item>
                            <Menu.Header>Transaction History</Menu.Header>
                            <Menu.Menu>
                                <Menu.Item name="Pending Transactions" onClick={() => setClickedMenu('pending_transactions')} />
                                <Menu.Item name="Completed Transactions" onClick={() => setClickedMenu('completed_transactions')} />
                            </Menu.Menu>
                        </Menu.Item>
                        <Menu.Item style={{ textAlign: 'center' }}>
                            <Menu.Header>More Features Coming Soon!</Menu.Header>
                        </Menu.Item>
                    </Menu>
                </Grid.Column>
                <Grid.Column width={13} style={{ paddingLeft: "0px"}}>
                    {/* <Tab panes={panes(paneProps)} /> */}
                    <div style={{backgroundColor: "white",height:"100%"}}>
                        {showMainContent()/* Ini gak boleh async */}
                    </div>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
}

export default AdminDashboard;