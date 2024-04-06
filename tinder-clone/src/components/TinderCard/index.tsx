import React, { useEffect, FunctionComponent, ReactNode, useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import { User } from '../../lib/definitions';
import Carousel from './Carousel';
import { Item } from './carousel-components';
const TinderCard: FunctionComponent = () => {
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch(process.env.REACT_APP_AWS_API + 'recommendations');
                const data = await response.json();
                setUsers(data);
            } catch (error) {
                console.error('Error fetching users', error);
            }
        }
        fetchUsers();
    }, [])
    return (
        <Carousel />
        );
}
export default TinderCard;