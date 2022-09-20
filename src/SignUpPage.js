import React from 'react';

class SignUpPage extends React.Component{
    render(){
        return(
        <div className="container-fluid" style={{height:"100vh"}}>
            <div className="container">
                <div className="row" style={{height:"20vh"}}>
                    Row pertama
                </div>
                <div className="row" style={{height:"80vh"}}>
                    {this.props.children}
                </div>
            </div>
        </div>
        );
    }
}

export default SignUpPage;