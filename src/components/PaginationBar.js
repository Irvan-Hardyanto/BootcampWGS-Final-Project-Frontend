import React from 'react';
import ReactPaginate from "react-paginate";

function PaginationBar(props) {
	return(
		<div style={{display:"inline-flex"}}>
        	<ReactPaginate
            	previousLabel={"< Prev"}
            	nextLabel={"Next >"}
            	pageCount={props.totalPage}
            	onPageChange={props.handlePageChange}
            	containerClassName={"ui menu"}
            	pageLinkClassName={"ui button"}
            	previousLinkClassName={"ui blue button"}
            	nextLinkClassName={"ui blue button"}
            	activeLinkClassName={"ui black button"}
            	disabledLinkClassName={"ui blue disabled button"}
        	/>  
    	</div>
	)	
}

export default PaginationBar;