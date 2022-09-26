import React from 'react';
import { Search, Grid, Header, Image, Button, Dropdown, Segment} from 'semantic-ui-react';

class CustomHeader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            options: [
                { key: 'edit', icon: 'edit', text: 'Edit Post', value: 'edit' },
                { key: 'delete', icon: 'delete', text: 'Remove Post', value: 'delete' },
                { key: 'hide', icon: 'hide', text: 'Hide Post', value: 'hide' },
            ]
        }
    }
    render() {
        return (
            <Grid.Row centered style={{height:this.props.height}}>
                <Grid.Column textAlign='center' width={3}>
                    <Header>
                        <Image circular src={this.props.imgSrc} style={{width:"8vw"}}/>
                    </Header>
                </Grid.Column>
                <Grid.Column textAlign='center' width={10}>
                    <Search placeholder="Type to search a product..." input={{ fluid: true }}></Search>
                </Grid.Column>
                <Grid.Column textAlign='center' width={3}>
                    <Button.Group color='teal'>
                        <Button>Save</Button>
                        <Dropdown
                            className='button icon'
                            floating
                            options={this.state.options}
                            trigger={<></>}
                        />
                    </Button.Group>
                </Grid.Column>
            </Grid.Row>
        );
    }
}

export default CustomHeader;