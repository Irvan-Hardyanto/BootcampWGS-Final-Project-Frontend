import React, { useState } from 'react';
import { Button, Modal, Icon, Form, TextArea, Image, Header } from 'semantic-ui-react';
import axios from 'axios';
import { useSelector } from "react-redux";

const BASE_URL = "http://localhost:9000";

const AddProductModal = (props) => {
    const [modalAddProductOpen, setModalAddProductOpen] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(0);
    const [stock, setStock] = useState(0);
    const [image, setImage] = useState(null);
    const [unit, setUnit] = useState('');
    const [nameError, setNameError] = useState(false);
    const [descriptionError, setDescriptionError] = useState(false);
    const [priceError, setPriceError] = useState(false);
    const [stockError, setStockError] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [unitError, setUnitError] = useState(false);
    const [addProductLoading, setAddProductLoading] = useState(false);
    const session = useSelector((state) => state.session)

    const setErrorMessage = (param, msg) => {
        if (param === "name") {
            setNameError(msg);
        } else if (param === "description") {
            setDescriptionError(msg);
        } else if (param === "price") {
            setPriceError(msg);
        } else if (param === "stock") {
            setStockError(msg);
        } else if (param === "image") {
            setImageError(msg);
        } else if (param === "unit") {
            setUnitError(msg);
        } else {
            alert('An error has been occured');
        }
    }

    const openModalAddProduct = () => {
        setModalAddProductOpen(true);
    }

    const closeModalAddProduct = () => {
        setModalAddProductOpen(false);
    }

    const handleNameChange = (event) => {
        const name=event.target.value;

        setName(event.target.value);
        setNameError(false);
    }

    const handleDescriptionChange = (event) => {
        setDescription(event.target.value);
        setDescriptionError(false);
    }

    const handlePriceChange = (event) => {
        setPrice(event.target.value);
        setPriceError(false);
    }

    const handleStockChange = (event) => {
        setStock(event.target.value);
        setStockError(false);
    }

    const handleImageChange = (event) => {
        event.preventDefault();
        setImage(event.target.files[0]);
        setImageError(false);
    }

    const handleUnitChange = (event) => {
        setUnit(event.target.value);
        setUnitError(false);
    }

    const handleFormSubmit = (event) => {
        event.preventDefault();
        setAddProductLoading(true);
        const axiosInstance = axios.create({
            baseURL: BASE_URL,
        })
        //pakai form data karena ada gambar,
        //sama saja dengan form yang enctype nya multipart/form-data
        const formData = new FormData();

        formData.append("name", name);
        formData.append("description", description);
        formData.append("price", price);
        formData.append("stock", stock);
        formData.append("image", image);
        formData.append("unit", unit);
        axiosInstance.post('/products', formData, {
            headers: {
                'user-id': session.userId,
                'user-role': session.role,
                'content-type': 'multipart/form-data; boundary=-----rick'
            }
        }).then(response => {
            setAddProductLoading(false);
            setModalAddProductOpen(false);
            console.log(response);
        }).catch(errors => {
            setAddProductLoading(false);
            for (let i = 0; i < errors.response.data.length; i++) {
                setErrorMessage(errors.response.data[i].param, errors.response.data[i].msg)
            }
            console.log(errors);
        })

    }

    return (
        <div>
            <Button onClick={openModalAddProduct} icon labelPosition='left' positive size='big'>
                <Icon name='plus circle' />
                Add New Product
            </Button>
            <Modal
                size='small'
                dimmer='inverted'
                open={modalAddProductOpen}
                onClose={closeModalAddProduct}
                onOpen={openModalAddProduct}
            >
                <Modal.Header>Add A Product...</Modal.Header>
                <Modal.Content>
                    <Form>
                        <Form.Group widths='equal'>
                            <Form.Input label="Product Picture" type="file" placeholder="Upload product picture" onChange={handleImageChange} error={imageError}></Form.Input>
                            {/*Bingkai buat gambarnya */}
                            {image &&
                                <div>
                                    <Header as="h5">Picture Preview</Header>
                                    <Image src={URL.createObjectURL(image)} size='medium' bordered></Image>
                                </div>
                            }
                        </Form.Group>
                        <Form.Input label="Product Name" type="text" placeholder="Insert Product Name" value={name} onChange={handleNameChange} error={nameError}></Form.Input>
                        <Form.Field
                            id='form-textarea-control-opinion'
                            control={TextArea}
                            label='Product Description'
                            placeholder='Describe the product'
                            value={description}
                            onChange={handleDescriptionChange}
                            error={descriptionError}
                        />
                        <Form.Group widths='equal'>
                            <Form.Input label="Product Price" type="number" placeholder="Insert Product Price" value={price} onChange={handlePriceChange} error={priceError}></Form.Input>
                            <Form.Input readOnly label="Preview Price" style={{ color: "black" }} type="text" value={`Rp. ${price.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ".")}`}></Form.Input>
                        </Form.Group>
                        <Form.Group widths='equal'>
                            <Form.Input label="Product Quantity" type="number" placeholder="Insert Product Quantity" value={stock} onChange={handleStockChange} error={stockError}></Form.Input>
                            <Form.Input label="Units" type="text" placeholder="Insert Product unit" value={unit} onChange={handleUnitChange} error={unitError}></Form.Input>
                        </Form.Group>
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button negative onClick={closeModalAddProduct}>
                        Cancel
                    </Button>
                    <Button onClick={handleFormSubmit} loading={addProductLoading} positive>
                        Add Product
                    </Button>
                </Modal.Actions>
            </Modal>
        </div>
    );

}

export default AddProductModal;