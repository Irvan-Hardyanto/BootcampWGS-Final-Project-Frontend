import React, { Component } from 'react';
import { Button, Modal, Icon, Form, TextArea, Image, Header } from 'semantic-ui-react';
import axios from 'axios';

const BASE_URL = "http://localhost:9000";

class AddProductModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalAddProductOpen: false,
            name: '',
            description: '',
            price: 0,
            stock: '',
            image: null,
            unit: '',
            nameError: false,
            descriptionError: false,
            priceError: false,
            stockError: false,
            imageError: false,
            unitError: false,
            addProductLoading: false
        }
        this.openModalAddProduct = this.openModalAddProduct.bind(this);
        this.closeModalAddProduct = this.closeModalAddProduct.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
        this.handlePriceChange = this.handlePriceChange.bind(this);
        this.handleStockChange = this.handleStockChange.bind(this);
        this.handleImageChange = this.handleImageChange.bind(this);
        this.handleUnitChange = this.handleUnitChange.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.setErrorMessage=this.setErrorMessage.bind(this);
    }

    setErrorMessage(param, msg) {
        if (param === "name") {
            this.setState({ nameError: msg })
        } else if (param === "description") {
            this.setState({ descriptionError: msg })
        }else if (param === "price") {
            this.setState({ priceError: msg })
        }else if (param === "stock") {
            this.setState({ stockError: msg })
        }else if (param === "image") {
            this.setState({ imageError: msg })
        }else if (param === "unit") {
            this.setState({ unitError: msg })
        }else{
            alert('An error has been occured');
        }
    }

    openModalAddProduct() {
        this.setState({ modalAddProductOpen: true });
    }

    closeModalAddProduct() {
        this.setState({ modalAddProductOpen: false });
    }

    handleNameChange(event) {
        this.setState({ name: event.target.value, nameError: false })
    }

    handleDescriptionChange(event) {
        this.setState({ description: event.target.value, descriptionError: false })
    }

    handlePriceChange(event) {
        this.setState({ price: event.target.value, priceError: false })
    }

    handleStockChange(event) {
        this.setState({ stock: event.target.value, stockError: false })
    }

    handleImageChange(event) {
        event.preventDefault();
        this.setState({ image: event.target.files[0], imageError: false })
    }

    handleUnitChange(event) {
        this.setState({ unit: event.target.value, unitError: false })
    }

    handleFormSubmit(event) {
        event.preventDefault();
        this.setState({addProductLoading: true},()=>{
            const axiosInstance = axios.create({
                baseURL: BASE_URL,
            })
            //pakai form data karena ada gambar,
            //sama saja dengan form yang enctype nya multipart/form-data
            const formData = new FormData();
    
            formData.append("name", this.state.name);
            formData.append("description", this.state.description);
            formData.append("price", this.state.price);
            formData.append("stock", this.state.stock);
            formData.append("image", this.state.image);//ini jadi error
            formData.append("unit", this.state.unit);
            axiosInstance.post('/product/add', formData, {
                headers: { 'content-type': 'multipart/form-data; boundary=-----rick' }
            }).then(response => {
                this.setState({addProductLoading:false, modalAddProductOpen: false});
                console.log(response);
            }).catch(errors => {
                this.setState({addProductLoading:false});
                for (let i = 0; i < errors.response.data.length; i++) {
                    this.setErrorMessage(errors.response.data[i].param, errors.response.data[i].msg)
                }
                console.log(errors);
            })
        })
    }

    render() {
        return (
            <div>
                <Button onClick={this.openModalAddProduct} icon labelPosition='left' positive size='big'>
                    <Icon name='plus circle' />
                    Add New Product
                </Button>
                <Modal
                    size='small'
                    dimmer='inverted'
                    open={this.state.modalAddProductOpen}
                    onClose={this.closeModalAddProduct}
                    onOpen={this.openModalAddProduct}
                >
                    <Modal.Header>Add A Product...</Modal.Header>
                    <Modal.Content>
                        <Form>
                            <Form.Group widths='equal'>
                                <Form.Input label="Product Picture" type="file" placeholder="Upload product picture" onChange={this.handleImageChange} error={this.state.imageError}></Form.Input>
                                {/*Bingkai buat gambarnya */}
                                {this.state.image &&
                                    <div>
                                        <Header as="h5">Picture Preview</Header>
                                        <Image src={URL.createObjectURL(this.state.image)} size='medium' bordered></Image>
                                    </div>
                                }
                            </Form.Group>
                            <Form.Input label="Product Name" type="text" placeholder="Insert Product Name" value={this.state.name} onChange={this.handleNameChange} error={this.state.nameError}></Form.Input>
                            <Form.Field
                                id='form-textarea-control-opinion'
                                control={TextArea}
                                label='Product Description'
                                placeholder='Describe the product'
                                value={this.state.description}
                                onChange={this.handleDescriptionChange}
                                error={this.state.descriptionError}
                            />
                            <Form.Group widths='equal'>
                                <Form.Input label="Product Price" type="number" placeholder="Insert Product Price" value={this.state.price} onChange={this.handlePriceChange} error={this.state.priceError}></Form.Input>
                                <Form.Input readOnly label="Preview Price" style={{ color: "black" }} type="text" value={`Rp. ${this.state.price.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ".")}`}></Form.Input>
                            </Form.Group>
                            <Form.Group widths='equal'>
                                <Form.Input label="Product Quantity" type="number" placeholder="Insert Product Quantity" value={this.state.stock} onChange={this.handleStockChange} error={this.state.stockError}></Form.Input>
                                <Form.Input label="Units" type="text" placeholder="Insert Product unit" value={this.state.unit} onChange={this.handleUnitChange} error={this.state.unitError}></Form.Input>
                            </Form.Group>
                        </Form>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button negative onClick={this.closeModalAddProduct}>
                            Cancel
                        </Button>
                        <Button onClick={this.handleFormSubmit} loading={this.state.addProductLoading} positive>
                            Add Product
                        </Button>
                    </Modal.Actions>
                </Modal>
            </div>
        );
    }
}

export default AddProductModal;