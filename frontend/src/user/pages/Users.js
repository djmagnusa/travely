import React, { useEffect, useState } from 'react';

import UsersList from '../components/UsersList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';

const Users = () => {

    // const USER = [
    //     {
    //         id: 'u1', 
    //         name: 'Pratush', 
    //         image: 'someurl', 
    //         places: 3
    //     }
    // ];

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const [loadedUsers, setLoadedUser] = useState();


    useEffect(() => {
        const sendRequest = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('http://localhost:5000/api/users')
        
                const responseData = await response.json();
    
                if(!response.ok) {
                    throw new Error(responseData.message)
                }

                setLoadedUser(responseData.users)
                
            } catch (err) {
                setIsLoading(false);
                setError(err.message);
            }

            setIsLoading(false);  
        };
        sendRequest(); //new function,  as making useEffect async is a bad code
    }, [])

    const errorHandler = () => {
        setError(null);
    }

   // return <UsersList items={USER} />;
    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={errorHandler} />   
            {isLoading && (
                <div className="center">
                    <LoadingSpinner />
                </div>
            )}
            {!isLoading && loadedUsers && <UsersList items={loadedUsers} />}
        </React.Fragment>
    )
};

export default Users;