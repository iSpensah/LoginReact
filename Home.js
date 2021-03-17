import React from 'react';
import {Link} from 'react-router-dom';

class Home extends React.Component {
    render() { 
        return ( 
            <div className='HomePageContainerStyle'>
                <h1>Welcome!</h1>
                <div className='LinkContainerStyle'>
                    <div className='LinkDivStyle'><Link to='/Register' className='CreateAccountLink'>Create Account</Link></div>
                    <div className='LinkDivStyle'><Link to='/Login' className='LoginLink'  >Login</Link></div>
                </div>
            </div>
         );
    }
}



export default Home;