import React, { useState,useEffect } from 'react';
import { Button, Modal, Icon, Form, TextArea, Image, Header } from 'semantic-ui-react';
import { NumericFormat } from "react-number-format";
import { useSelector } from "react-redux";
import axios from 'axios';

const BASE_URL = "http://localhost:9000";
const PRICE_PREFIX = "Rp. ";
const PRICE_SUFFIX = ",00";
const DECIMAL_SEPARATOR = ",";
const THOUSAND_SEPARATOR= ".";

const axiosInstance = axios.create({
    baseURL: BASE_URL
})

const EditProductModal = (props) => {
	const [productPicture,setProductPicture] = useState(null);
	const [productId,setProductId]=useState('');
	const [productName,setProductName] = useState('');
	const [productDescription,setProductDescription] = useState('');
	const [productPrice,setProductPrice]=useState(0);
	const [productStock,setProductStock]=useState(0);
	const [unit,setUnit]=useState('');
	const [secondMdlOpen,setSecondMdlOpen]=useState(false);
	const [saveBtnLoading,setSaveBtnLoading]=useState(false);
	const session = useSelector((state) => state.session)

	useEffect(()=>{
		if(props.product){
			setProductId(props.product.id);
			setProductName(props.product.name);
			setProductDescription(props.product.description);
			setProductPrice(props.product.price);
			setProductStock(props.product.stock);
			setUnit(props.product.unit)
		}
	},[props.product])
	// console.log("state product on edit product modal is: "+props.product);
	

	const handleProductNameChange = (event) => {
        const name=event.target.value;
        setProductName(event.target.value);
    }

    const handleDescriptionChange = (event) => {
        setProductDescription(event.target.value);
    }

    const handlePriceChange = (event) => {
        //ternyata masih harus manual misahin + ngeparse angkanya...
        //cara nge parse kayak gini masih ngebug untuk harga diatas Rp.999.999,00
        const extractedPrice= (event.target.value).replace(PRICE_PREFIX,"").replace(PRICE_SUFFIX,"").replace(".","");
        setProductPrice(parseInt(extractedPrice));
    }

    const handleStockChange = (event) => {
        setProductStock(event.target.value);
    }

    const handleProductPictureChange = (event) => {
        event.preventDefault();
        setProductPicture(event.target.files[0]);
    }

    const handleUnitChange = (event) => {
        setUnit(event.target.value);
    }

    const handleSaveButtonClicked=()=>{
    	console.log('prodid updateis: '+productId)
    	setSaveBtnLoading(true);
    	
    	const formData = new FormData();
    	formData.append("name", productName);
        formData.append("description", productDescription);
        formData.append("price", productPrice);
        formData.append("stock", productStock);
        formData.append("image", productPicture);
        formData.append("unit", unit);

    	axiosInstance.put(`/products/${productId}`,formData,{
            headers: {
                'user-id': session.userId,
                'user-role': session.role,
                'content-type': 'multipart/form-data; boundary=-----rick'
            }
        }).then(response=>{
        	setSecondMdlOpen(false);
        	setSaveBtnLoading(false);
        }).catch(error=>{
        	setSaveBtnLoading(false);
        	alert('an error has occured')
        	console.log(error);
        })
    	
    }
	return(
		<div>
			<Modal open={props.modalOpen} onClose={()=>props.setModalOpen(false)}>
				<Modal.Header>Edit Product Information</Modal.Header>
				<Modal.Content>
					<Form>
						<Form.Group widths='equal'>
							<Form.Field>
     						<label>Product Picture</label>
                            {/*Bingkai buat gambarnya */}
                            <Image size='medium' bordered src={productPicture ?URL.createObjectURL(productPicture) : BASE_URL + '/product/picture/' + productId}/>
                            <Button color='green' onClick={()=>{setSecondMdlOpen(true)}}>Change product picture</Button>
                            </Form.Field>
                            
                        </Form.Group>
						<Form.Input label="Product Name" type="text" placeholder="Insert Product Name" value={productName} onChange={handleProductNameChange}/>
						<Form.Field
                            id='form-textarea-control-opinion'
                            control={TextArea}
                            label='Product Description'
                            placeholder='Describe the product'
                            value={productDescription}
                            onChange={handleDescriptionChange}
                        />
                        <Form.Field>
                            <label>Product Price</label>
                            <NumericFormat 
                            prefix={PRICE_PREFIX}
                            suffix={PRICE_SUFFIX}
                            type="text"
                            decimalSeparator={DECIMAL_SEPARATOR}
                            thousandSeparator={THOUSAND_SEPARATOR}
                            allowNegative={false}
                            value={parseInt(productPrice)} 
                            onChange={handlePriceChange} 
                            
                        />
                        </Form.Field>
                        <Form.Group widths='equal'>
                            <Form.Input label="Product Quantity" type="number" placeholder="Insert Product Quantity" value={productStock} onChange={handleStockChange}></Form.Input>
                            <Form.Input label="Units" type="text" placeholder="Insert Product unit" value={unit} onChange={handleUnitChange}></Form.Input>
                        </Form.Group>
					</Form>
				</Modal.Content>
				<Modal.Actions>
					<Button color='red' onClick={()=>props.setModalOpen(false)}>
						Cancel
					</Button>
					<Button color='green'onClick={handleSaveButtonClicked} loading={saveBtnLoading}>
						Save Changes
					</Button>
				</Modal.Actions>
				<Modal
          			onClose={() => setSecondMdlOpen(false)}
          			open={secondMdlOpen}
          			size='small'
        		>
          			<Modal.Header>Change Product Picture</Modal.Header>
          			<Modal.Content>
            			<Form>
                        	<Form.Group widths='equal'>
                        		{productPicture &&
                                	<div>
                                    	<Header as="h5">New Product Picture Preview</Header>
                                    	<Image src={URL.createObjectURL(productPicture)} size='medium' bordered></Image>
                                	</div>
                            	}
                            	<Form.Input label="New Product Picture" type="file" placeholder="Upload new product picture" onChange={handleProductPictureChange}></Form.Input>
                            	
                        	</Form.Group>
                        </Form>
          			</Modal.Content>
          			<Modal.Actions>
          				<Button color="red" onClick={() => {
          					setProductPicture(null);
          					setSecondMdlOpen(false)
          				}}>Cancel</Button>
            			<Button color="green" onClick={() => setSecondMdlOpen(false)}>Change Product Picture</Button>
          			</Modal.Actions>
        	</Modal>
			</Modal>
		</div>
	)
}

export default EditProductModal;