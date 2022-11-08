import React, { useState, useEffect } from 'react';
import { Grid, Header, Table, Image, Button, Input, Pagination, Icon, Modal, Message } from 'semantic-ui-react';
import { useSelector } from "react-redux";
import axios from 'axios';
import { faker } from '@faker-js/faker';
import PaginationBar from "../../components/PaginationBar";

const BASE_URL = "http://localhost:9000";

const axiosInstance = axios.create({
    baseURL: BASE_URL,
})

const UserList = (props) => {
    const ROWS_PER_PAGE = 6;
    const [users, setUsers] = useState([]);
    

    const [activePage, setActivePage] = useState(0);
    const [totalRows, setTotalRows] =useState(0);
    const [totalPage,setTotalPage] = useState(0)
    const [searchQuery, setSearchQuery] = useState('');

    const [modalContent, setModalContent] = useState('');
    const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    const session = useSelector((state) => state.session);
    const [userId,setUserId]=useState(0);
    const [newRole,setNewRole]=useState(0);

    useEffect(() => {
        axiosInstance.get(props.url+`&search-query=${searchQuery}&page=${activePage}&limit=${ROWS_PER_PAGE}`, {
            headers: {
                'user-id': session.userId,
                'user-role': session.role
            }
        }).then(response => {
            setUsers(response.data.result);
            setTotalPage(response.data.totalPage);
            setTotalRows(response.data.totalRows);
            setActivePage(response.data.page);
        }).catch(err => {
            console.log(err);
        })
    }, [props.url,activePage,searchQuery])

    const handlePageChange = ({selected}) => {
        setActivePage(selected);
    }

    const deleteUser = (userId) => {
        setUsers(users.filter(user => {
            return !(user.id === userId)
        }));
        axiosInstance.delete(`/users/${userId}`, {
            headers: {
                'user-id': session.userId,
                'user-role': session.role
            }
        }).then(response => {

        }).catch(err => {
            console.log(err);
        })
    }

    //ini harus di delete dari daftar admin
    const setUserRole = (userId, role) => {
        setUsers(users.filter(user => {
            return !(user.id === userId)
        }));
        axiosInstance.put(`/users?userid=${userId}&role=${role}`,undefined,{
            headers: {
                'user-id': session.userId,
                'user-role': session.role
            }
        })
    }

    const openConfirmationModal = (role,userId) => {
        setUserId(userId);
        if (role == 3) {
            setModalContent('Are You Sure With Your Want to Elect This User As a Admin?')
            setNewRole(2);
        } else if (role == 2) {
            setModalContent('Are You Sure With Your Want to De-Elect This User to a regular customer?')
            setNewRole(3);
        }
        
        setConfirmationModalOpen(true);
    }


    const closeConfirmationModal = () => {

        setConfirmationModalOpen(false);
    }

    const openDeleteModal = (userId)=>{
        setDeleteModalOpen(true);
        setUserId(userId);
    }

    const handleSearchBarInput = (event) => {
        setSearchQuery(event.target.value.toLowerCase());
    }

    return (
        <Grid verticalAlign='middle' padded style={{ height: "100%" }}>
            <Grid.Row style={{ height: "12%" }}>
                <Grid.Column width={4}>
                    <Header as='h1'>{props.title}</Header>
                </Grid.Column>
                <Grid.Column width={12}>
                    <Input style={{width:'100%'}} icon='search' placeholder='Search Customers by Name...' onChange={handleSearchBarInput}></Input>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row style={{ padding: "0px", height: "78%" }}>
                <Table celled striped selectable>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>ID</Table.HeaderCell>
                            <Table.HeaderCell>Photo</Table.HeaderCell>
                            <Table.HeaderCell>Name</Table.HeaderCell>
                            <Table.HeaderCell>Email</Table.HeaderCell>
                            <Table.HeaderCell>Mobile</Table.HeaderCell>
                            <Table.HeaderCell>Username</Table.HeaderCell>
                            {/* <Table.HeaderCell>Password</Table.HeaderCell> */}
                            <Table.HeaderCell>Action</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {users.map((user, idx) => {
                            return (
                                <Table.Row key={user.id}>
                                    <Table.Cell> {user.id}</Table.Cell>
                                    <Table.Cell> <Image src={faker.image.avatar()} avatar /></Table.Cell>
                                    <Table.Cell> {user.name}</Table.Cell>
                                    <Table.Cell>{!user.email ? <Icon name='question'></Icon> : user.email}</Table.Cell>
                                    <Table.Cell>{!user.mobile ? <Icon name='question'></Icon> : user.mobile}</Table.Cell>
                                    <Table.Cell>{user.userName}</Table.Cell>
                                    {/* <Table.Cell>{customer.password}</Table.Cell> */}
                                    <Table.Cell>
                                        <Button primary onClick={() => openConfirmationModal(parseInt(user.role),parseInt(user.id))}>{user.role == 3 ? 'Elect As Admin' : 'De-elect from admin'}</Button>
                                        {/*<Button.Group>
                                            <Button primary onClick={() => openConfirmationModal(parseInt(user.role),parseInt(user.id))}>{user.role == 3 ? 'Elect As Admin' : 'De-elect from admin'}</Button>
                                            <Button.Or />
                                            <Button negative onClick={()=> openDeleteModal(parseInt(user.id))}>Delete</Button>
                                        </Button.Group>*/}
                                    </Table.Cell>
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

            {/* Modal konfirmasi angkat ke admin / turunkan dari admin */}
            <Modal size="tiny" dimmer='inverted' open={confirmationModalOpen} onClose={closeConfirmationModal}>
                <Modal.Content>
                    <Message warning>
                        <Message.Header>{modalContent}</Message.Header>
                    </Message>
                </Modal.Content>
                <Modal.Actions>
                    <Button negative onClick={closeConfirmationModal}>
                        No
                    </Button>
                    <Button positive onClick={()=>{
                        setUserRole(userId,newRole);
                        closeConfirmationModal()
                    }}>
                        Yes
                    </Button>
                </Modal.Actions>
            </Modal>

            {/* Modal untuk konfirmasi hapus pengguna */}
            <Modal size="tiny" dimmer='inverted' open={deleteModalOpen} onClose={()=>setDeleteModalOpen(false)}>
                <Modal.Content>
                    <Message negative>
                        <Message.Header>Are You Sure to Delete this User?</Message.Header>
                        <p>This action cannot be undone! </p>
                    </Message>
                </Modal.Content>
                <Modal.Actions>
                    <Button negative onClick={()=>setDeleteModalOpen(false)}>
                        No
                    </Button>
                    <Button positive onClick={()=>{
                        console.log('selected user id is: '+userId);
                        // deleteUser(userId)
                        setDeleteModalOpen(false);
                    }}>
                        Yes
                    </Button>
                </Modal.Actions>
            </Modal>
        </Grid>
    )

}

export default UserList;