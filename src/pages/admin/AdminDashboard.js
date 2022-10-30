import React, { useState } from 'react';
import { Grid, Menu, Header, Button } from 'semantic-ui-react';
import PendingTransactions from './PendingTransactions';
import CompletedTransactions from './CompletedTransactions';
import ProductList from './ProductList';
import SellingList from './SellingList';
import PerProductSellingList from './PerProductSellingList';
import PerCustomerSellingList from './PerCustomerSellingList'
import HttpLog from '../HttpLog';
import logOut from '../../utils/LogOut';
import { useDispatch, useSelector } from "react-redux";

function AdminDashboard(props) {
    const [clickedMenu, setClickedMenu] = useState('products');
    const dispatch = useDispatch();
    const session = useSelector((state) => state.session);

    const showMainContent = () => {
        if (clickedMenu === 'pending_transactions') {
            return <PendingTransactions />
        } else if (clickedMenu === 'completed_transactions') {
            return <CompletedTransactions />;
        } else if (clickedMenu === 'products') {
            return <ProductList />;
        } else if (clickedMenu.includes("sellinglist")) {
            if (clickedMenu === 'sellinglist/all') {
                return <SellingList/>;
            }else if (clickedMenu === 'sellinglist/product') {
                return <PerProductSellingList/>
            } else if (clickedMenu === 'sellinglist/customer') {
                 return <PerCustomerSellingList/>
            }
            
        } else if (clickedMenu === 'http_logs') {
            return <HttpLog />
        }
    }

    return (
        <Grid padded style={{ height: "100%" }}>
            <Grid.Row style={{ height: "10%" }}>
                <Grid.Column>
                    <Menu>
                        <Menu.Item>
                            <Header as='h1'>Admin Dashboard</Header>
                        </Menu.Item>
                        <Menu.Item position='right'>
                            {`Logged in as ${session.fullname}`}
                        </Menu.Item>
                        <Menu.Item position='right'>
                            <Button color='red' onClick={() => logOut(dispatch)}>Log Out</Button>
                        </Menu.Item>
                    </Menu>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row style={{ height: "90%" }}>
                <Grid.Column width={3} style={{ height: "100%" }}>
                    <Menu style={{ height: "100%", width: "100%" }} pointing vertical>
                        <Menu.Item>
                            <Menu.Header>Inventory</Menu.Header>
                            <Menu.Menu>
                                <Menu.Item name="Product list" onClick={() => setClickedMenu('products')} />
                            </Menu.Menu>
                        </Menu.Item>
                        <Menu.Item>
                            <Menu.Header>Selling List</Menu.Header>
                            <Menu.Menu>
                                <Menu.Item name="Show All" onClick={() => setClickedMenu('sellinglist/all')} />
                                {/*<Menu.Item name="Daily (Coming Soon!)" onClick={() => setClickedMenu('sellinglist/daily')} />
                                <Menu.Item name="Weekly (Coming Soon!)" onClick={() => setClickedMenu('sellinglist/weekly')} />
                                <Menu.Item name="Monthly (Coming Soon!)" onClick={() => setClickedMenu('sellinglist/monthly')} />*/}
                                <Menu.Item name="By Product" onClick={() => setClickedMenu('sellinglist/product')} />
                                <Menu.Item name="By Customer" onClick={() => setClickedMenu('sellinglist/customer')} />
                            </Menu.Menu>
                        </Menu.Item>
                        <Menu.Item>
                            <Menu.Header>Transaction History</Menu.Header>
                            <Menu.Menu>
                                <Menu.Item name="Pending Transactions" onClick={() => setClickedMenu('pending_transactions')} />
                                <Menu.Item name="Completed Transactions" onClick={() => setClickedMenu('completed_transactions')} />
                            </Menu.Menu>
                        </Menu.Item>
                        <Menu.Item>
                            <Menu.Header>Logs</Menu.Header>
                            <Menu.Menu>
                                <Menu.Item name="HTTP Logs" onClick={() => setClickedMenu('http_logs')} />
                            </Menu.Menu>
                        </Menu.Item>
                        <Menu.Item style={{ textAlign: 'center' }}>
                            <Menu.Header>More Features Coming Soon!</Menu.Header>
                        </Menu.Item>
                    </Menu>
                </Grid.Column>
                <Grid.Column width={13} style={{ paddingLeft: "0px" }}>
                    {/* <Tab panes={panes(paneProps)} /> */}
                    <div style={{ backgroundColor: "white", height: "100%" }}>
                        {showMainContent()/* Ini gak boleh async */}
                    </div>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
}

export default AdminDashboard;