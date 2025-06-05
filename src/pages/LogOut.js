import { useEffect, useContext, useState } from 'react';
import { UserContext } from '../userContext';
import { Navigate } from 'react-router-dom';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

function LogOut(){
    const userContext = useContext(UserContext); 
    const [resTrue, setResTrue] = useState(false)
    useEffect(function(){
        const logout = async function(){
            userContext.setUserContext(null);
            cookies.remove('jwt', { path: '/' });
            const res = true;
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