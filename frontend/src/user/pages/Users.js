import React, { useEffect, useState } from 'react';

import UsersList from '../components/UsersList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';

const Users = () => {

    // const USER = [
    //     {
    //         id: 'u1', 
    //         name: 'Pratush', 
    //         image: 'someurl', 
    //         places: 3
    //     }
    // ];

    // const [isLoading, setIsLoading] = useState(false);
    // const [error, setError] = useState();
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const [loadedUsers, setLoadedUser] = useState();


    useEffect(() => {
        const fetchUsers = async () => {
            // setIsLoading(true);

            try {
                const responseData = await sendRequest('http://localhost:5000/api/users')
        
                // const responseData = await response.json();
    
                // if(!response.ok) {
                //     throw new Error(responseData.message)
                // }

                setLoadedUser(responseData.users)
                
            } catch (err) {
                // setIsLoading(false);
                // setError(err.message);
            }

            // setIsLoading(false);  
        };
        fetchUsers(); //new function,  as making useEffect async is a bad code
    }, [sendRequest])

    // const errorHandler = () => {
    //     setError(null);
    // }

   // return <UsersList items={USER} />;
    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />   
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