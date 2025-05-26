import { useEffect, useContext, useState } from 'react';
import { UserContext } from '../userContext';
import { Navigate } from 'react-router-dom';

function LogOut(){
    const userContext = useContext(UserContext); 
    const [resTrue, setResTrue] = useState(false)
    useEffect(function(){
        const logout = async function(){
            userContext.setUserContext(null);
            //const res = await fetch("http://localhost:3001/users/logout");
            const res = true; // ko bo backend imel nek session se tu calla logout
            setResTrue(res)
        }
        logout();
    }, [userContext]);

    return (
        <div>
            {resTrue && (<Navigate replace to="/" />)}
        </div>
    );
}

export default LogOut;