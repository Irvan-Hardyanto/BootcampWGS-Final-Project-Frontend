import React, { useState } from 'react';
import { Button, Grid, Menu, Input, Header } from 'semantic-ui-react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";

import logOut from '../../utils/LogOut';
import ProductList from '../ProductList';


const LandingPage = (props) => {
    const session = useSelector((state) => state.session);
    const [activeMenu, setActiveMenu] = useState("Products");
    const [searchQuery, setSearchQuery] = useState('')
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleMenuItemClicked = (e, { name }) => {
        if (name != "Products" && !session.userId) {
            navigate('/login')
        }
        setActiveMenu(name);
    }
    const showMainContent = () => {
        if (activeMenu === 'Products') {
            return <ProductList searchQuery={searchQuery} />
        }
    }
    const handleSearchBarInput = (event) => {
        console.log('search bar value is changed...')
        setSearchQuery(event.target.value);
    }

    const showSearchBar = () => {
        if (activeMenu === 'Products' || activeMenu === "Cart" || activeMenu === "Purchase History") {
            return (
                <Menu.Item style={{ width: '30%' }}>
                    <Input className='icon' icon='search' placeholder='Search...' onChange={handleSearchBarInput} />
                </Menu.Item>
            )
        }
    }
    const renderProfileButton = (userId) => {
        if (!userId) {
            return (
                <Link to='/login'>
                    <Button color='green'>Login As Customer</Button>
                </Link>
            )
        } else {
            return (
                <>
                    <Link to='/profile'>
                        <Menu.Item
                            name="Profile"
                            active={activeMenu === "Profile"}
                            onClick={handleMenuItemClicked}
                        >{`Welcome, ${session.fullname}`}</Menu.Item>
                    </Link>
                    <Menu.Item>
                        <Button color='red' onClick={() => logOut(dispatch)}>Logout</Button>
                    </Menu.Item>
                </>
            )
        }
    }
    return (
        <Grid padded style={{ height: '100%' }}>
            <Grid.Row style={{ height: '10%', backgroundColor: 'white' }}>
                <Menu secondary style={{ height: '100%', width: '100%' }}>
                    <Menu.Item>
                        <Header as='h1'>SHOPPING APP</Header>
                    </Menu.Item>
                    <Menu.Item
                        name="Products"
                        active={activeMenu === "Products"}
                        onClick={handleMenuItemClicked}
                    />
                    <Link to="/cart">
                        <Menu.Item
                            name="Cart"
                            active={activeMenu === "Cart"}
                            onClick={handleMenuItemClicked}
                        />
                    </Link>
                    <Menu.Item
                        name="Purchase History"
                        active={activeMenu === "Purchase History"}
                        onClick={handleMenuItemClicked}
                    />
                    {/* Search bar */}
                    {showSearchBar()}
                    <Menu.Menu position='right'>
                        {renderProfileButton(session.userId)}
                    </Menu.Menu>
                </Menu>
            </Grid.Row>
            <Grid.Row style={{ height: '90%' }}>
                <Grid.Column style={{ maxHeight: "100%", overflow: "auto" }}>
                    {showMainContent()}
                </Grid.Column>
            </Grid.Row>
        </Grid>

    )
}

export default LandingPage;