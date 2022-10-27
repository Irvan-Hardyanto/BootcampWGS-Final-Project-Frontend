import React, { useState } from 'react';
import { Grid, Menu, Header, Button } from 'semantic-ui-react';
import UserList from './UserList';
import HttpLog from '../HttpLog';
import logOut from '../../utils/LogOut';
import { useDispatch } from "react-redux";

function Dashboard(props) {
    const [clickedMenu, setClickedMenu] = useState('');
    const dispatch=useDispatch();

    const showMainContent = () => {
        if (clickedMenu === 'customers') {
            return <UserList url='/users?role=3' title={'Customer List'}/>;
        } else if (clickedMenu === 'admins') {
            return <UserList url='/users?role=2' title={'Admin List'}/>;
        } else if(clickedMenu === 'httplog'){
            return <HttpLog/>
        }
    }
    return (
        <Grid padded style={{ height: "100%" }}>
            <Grid.Row style={{ height: "10%" }}>
                <Grid.Column width={8}>
                    <Header as='h1'>Super Admin Dashboard</Header>
                </Grid.Column>
                <Grid.Column width={8}>
                    <Button color='red' onClick={()=>logOut(dispatch)}>Log Out</Button>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row style={{ height: "90%" }}>
                <Grid.Column width={3} style={{ height: "100%" }}>
                    <Menu style={{ height: "100%", width: "100%" }} pointing vertical>
                        <Menu.Item>
                            <Menu.Header>Users List</Menu.Header>
                            <Menu.Menu>
                                <Menu.Item name="Customer List" onClick={() => setClickedMenu('customers')} />
                            </Menu.Menu>
                            <Menu.Menu>
                                <Menu.Item name="Admin List" onClick={() => setClickedMenu('admins')} />
                            </Menu.Menu>
                        </Menu.Item>
                        <Menu.Item>
                           <Menu.Header>Logs</Menu.Header>
                           <Menu.Menu>
                                <Menu.Item name="HTTP Logs" onClick={()=> setClickedMenu('httplog')}/>
                           </Menu.Menu> 
                        </Menu.Item>
                    </Menu>
                </Grid.Column>
                <Grid.Column width={13} style={{ paddingLeft: "0px" }}>
                    <div style={{ backgroundColor: "white", height: "100%" }}>
                        {showMainContent()/* Ini gak boleh async */}
                    </div>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
}

export default Dashboard;