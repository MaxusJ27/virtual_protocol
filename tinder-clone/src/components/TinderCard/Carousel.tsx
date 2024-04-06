import React, { useEffect, useState, useRef } from 'react';
import { useSwipeable } from 'react-swipeable';
import {
    CarouselContainer,
    CarouselSlot,
    SlideButton,
} from './carousel-components';
// icons
import { FaHeart, } from 'react-icons/fa';
import { IoHeartDislikeOutline } from "react-icons/io5";
// clsx
import clsx from 'clsx';
import { User } from '../../lib/definitions';

const NEXT = 'NEXT';
const PREV = 'PREV';

type Direction = typeof PREV | typeof NEXT;

interface CarouselState {
    pos: number;
    sliding: boolean;
    dir: Direction;
    status: string;
}

type CarouselAction =
    | { type: Direction, numItems: number }
    | { type: 'updateNumber', numItems: number }
    | { type: 'stopSliding' };

const getOrder = (index: number, pos: number, numItems: number) => {
    return index - pos < 0 ? numItems - Math.abs(index - pos) : index - pos;
};

const getInitialState = (numItems: number): CarouselState => ({ pos: numItems - 1, sliding: false, dir: NEXT, status: "" });

const Carousel = () => {
    const [users, setUsers] = useState<User[]>([]);
    let numItems = 10;
    const [state, dispatch] = React.useReducer(reducer, getInitialState(numItems));
    const [loading, setLoading] = useState<boolean>(false);

    const initialPos = useRef<number>(0);

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
        initialPos.current = state.pos;
    }, []);

    const updateUser = async () => {
        try {
            const updatedUserID = users[state.pos + 1].id;
            console.log(users, updatedUserID, state.status);
            setLoading(true);
            const response = await fetch(process.env.REACT_APP_AWS_API + 'users/' + updatedUserID, {
            // const response = await fetch("http://localhost:8000/api/users/" + updatedUserID, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: state.status }),
            });
            const data = await response.json();
            // filter out user with id
            setUsers(prevUsers => prevUsers.filter(user => user.id !== updatedUserID));
            setLoading(false);
        } catch (error) {
            console.error('Error updating user', error);
        }
    }

    useEffect(() => {
        if (state.pos !== initialPos.current) {
            updateUser();
        }
    }, [state.pos]);

    const slide = async (dir: Direction) => {
        console.log(`Swiped to ${dir} with ${state.pos} position and is current ${state.sliding}`);
        if (state.pos < 0)  {
            return;
        }
        dispatch({ type: dir, numItems });
        setTimeout(() => {
            dispatch({ type: 'stopSliding' });
        }, 400);
    };

    const handlers = useSwipeable({
        onSwipedLeft: () => slide(NEXT),
        onSwipedRight: () => slide(PREV),
        swipeDuration: 500,
        preventScrollOnSwipe: true,
        trackMouse: true
    });

    return (
        <div {...handlers}>
            <div className="w-full h-[240px] overflow-hidden shadow-lg">
                <CarouselContainer dir={state.dir} sliding={state.sliding}>
                    {users.map((user, index) => (
                        <CarouselSlot
                            order={getOrder(index, state.pos, numItems)}
                            key={user.id}
                        >
                            {loading ? (
                                <div className="flex justify-center items-center w-full h-full">
                                    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
                                </div>
                            ) : (
                                state.pos <= -1 ? (
                                    <div className=" w-full rounded-xl bg-cover  p-[100px]" style={{}}>
                                        <h1 className='text-lg font-semibold'>All 10 recommendations gone through. I hoped you like the recommended selections!</h1>
                                    </div>
                                ) : (
                                    <div className=" w-full rounded-xl bg-cover p-[100px]" style={{}}>
                                        <h1 className='text-lg font-semibold'>{user.name}</h1>
                                        <h1 className='text-lg font-semibold'>{user.location}</h1>
                                        <h1 className='text-lg font-semibold'>{user.university}</h1>
                                        <h1 className='text-lg font-semibold'>{user.interests}</h1>
                                    </div>
                                )
                            )}
                        </CarouselSlot>
                    )
                    )}
                </CarouselContainer>
            </div>
            <div className='flex justify-between items-center pb-4'>
                <SlideButton onClick={() => slide(PREV)} float="left">
                    {<FaHeart className={
                        clsx(
                            'text-black',
                            state.sliding && state.dir === PREV && 'text-red-600 transform scale-125 transition ease-in-out duration-400')} />
                    }
                </SlideButton>
                {
                    <h1 className={
                        clsx(
                            "text-2xl transition ease-in-out duration-300",
                            state.sliding && state.dir === PREV ? "text-red-600" : "text-gray-600"
                        )
                    }>{state.status}</h1>
                }
                <SlideButton onClick={() => slide(NEXT)} float="right">
                    <IoHeartDislikeOutline
                        className={
                            clsx(
                                'text-black',
                                state.sliding && state.dir === NEXT && 'text-blue-600 transform scale-125 transition ease-in-out duration-400'
                            )
                        }
                    />
                </SlideButton>
            </div>
        </div>
    );
};

// convert to redux reducer, swipe right means adding to list of liked users, swipe left means adding to list of disliked users
function reducer(state: CarouselState, action: CarouselAction): CarouselState {
    switch (action.type) {
        case PREV:
            return {
                ...state,
                dir: PREV,
                sliding: true,
                pos: state.pos < 0 ? 0: state.pos - 1,
                // pos: state.pos = state.pos + 1,
                status: "liked"
            };
        case NEXT:
            return {
                ...state,
                dir: NEXT,
                sliding: true,
                // pos: state.pos = state.pos + 1,
                pos: state.pos - 1,
                status: "disliked"
            };
        case 'stopSliding':
            return { ...state, sliding: false, status: "" };
        default:
            return state;
    }
}

export default Carousel;