import React from 'react';

class FormCenteredSmall extends React.Component {
    render() {
        return (
            <div className="container-fluid" style={{height: "100vh", backgroundColor: this.props.bgColor}}>
                <div className="row align-items-center" style={{height: "100vh"}}>
                    <div className="container py-3" style={{width: "30vw", backgroundColor: "white"}}>
                        <div className="row justify-content-center">
                            <img src="./images/cart.png" style={{width: "100px",height:"auto"}} alt="logo"/>
                        </div>
                        <div className="row">
                            <h1>{this.props.title}</h1>
                        </div>
                        <div className="row">
                            {this.props.children}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default FormCenteredSmall;