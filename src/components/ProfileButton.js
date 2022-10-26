import React from 'react';
import { Dropdown, Button } from 'semantic-ui-react'

function ProfileButton(props) {
    const options = [
        { key: 'edit', icon: 'edit', text: 'Edit Post', value: 'edit' },
        { key: 'delete', icon: 'delete', text: 'Remove Post', value: 'delete' },
        { key: 'hide', icon: 'hide', text: 'Hide Post', value: 'hide' },
    ]
    return (
        <Button.Group color='teal'>
            <Button>Log Out</Button>
            <Dropdown
                className='button icon'
                floating
                options={options}
                trigger={<></>}
            />
        </Button.Group>
    );
}

export default ProfileButton;