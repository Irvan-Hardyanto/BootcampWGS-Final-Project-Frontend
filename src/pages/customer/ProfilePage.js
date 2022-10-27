import React, { useState } from 'react';
import { Grid, Menu, Form, Input, Image, Header } from 'semantic-ui-react';
import { useSelector } from "react-redux";
import { Link, useNavigate } from 'react-router-dom';

//Profile Page untuk semua user
function ProfilePage(props) {
    const [activeMenu, setActiveMenu] = useState("Profile");
    const [profilePicture, setProfilePicture] = useState(null);
    const session = useSelector((state) => state.session);
    const navigate = useNavigate();

    const handleMenuItemClicked = (e, { name }) => {
        if (name != "Products" && !session.userId) {
            navigate('/login')
        }
        setActiveMenu(name);
    }

    const handleProfilePictureChanged = (event) => {
        event.preventDefault();
        setProfilePicture(event.target.files[0]);
    }
    const showProfilePicture=()=>{
        let imgSrc=profilePicture ? URL.createObjectURL(profilePicture): './images/blank-pp.png';
        return <Image src={imgSrc} size='small' bordered></Image>;
    }

    return (
        <Grid padded>
            <Grid.Row style={{ height: '10%', backgroundColor: 'white' }}>
                <Menu secondary style={{ height: '100%' }}>
                    <Menu.Item>
                        <Header as='h1'>SHOPPING APP</Header>
                    </Menu.Item>
                    <Menu.Item
                        name="Products"
                        active={activeMenu === "Products"}
                        onClick={handleMenuItemClicked}
                    />
                    <Menu.Item
                        name="Cart"
                        active={activeMenu === "Cart"}
                        onClick={handleMenuItemClicked}
                    >
                        <Link to="/cart">
                            Cart
                        </Link>
                    </Menu.Item>
                    <Menu.Item
                        name="Purchase History"
                        active={activeMenu === "Purchase History"}
                        onClick={handleMenuItemClicked}
                    />
                    <Menu.Item
                        name="Profile"
                        active={activeMenu === "Profile"}
                        onClick={handleMenuItemClicked}
                    />
                    <Menu.Item>
                        <Input className='icon' icon='search' placeholder='Search...' />
                    </Menu.Item>
                </Menu>
            </Grid.Row>
            <Grid.Row style={{ height: '90%' }}>
                <Grid.Column>
                    <div style={{ backgroundColor: 'white',padding:'1em' }}>
                        <Header as='h1'>Edit Profile</Header>
                        <Form>
                            <Form.Group widths='equal'>
                                {showProfilePicture()}
                                <Form.Input label="Profile Picture" type="file" placeholder="Upload profile picture" onChange={handleProfilePictureChanged}></Form.Input>
                            </Form.Group>
                            <Form.Input
                                label='Full Name'
                                name='name'
                                type='text'
                            />
                            <Form.Input
                                label='Username'
                                name='userName'
                                type='text'
                            />
                            <Form.Input
                                label='Mobile Phone Number'
                                name='mobile'
                                type='text'
                            />
                            <Form.Input
                                label='Email'
                                name='email'
                                type='email'
                            />
                        </Form>
                    </div>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
}

//Profile 
export default ProfilePage;