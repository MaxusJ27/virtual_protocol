import { useState, useEffect, Suspense } from "react";
import { User } from "../../lib/definitions";
import TableSkeleton from "../../components/Skeletons";
import clsx from "clsx";
const TinderList = () => {

    const [users, setUsers] = useState<User[]>([]);
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch(process.env.REACT_APP_AWS_API + 'users/status');
                const data = await response.json();
                setUsers(data);
            } catch (error) {
                console.error('Error fetching users', error);
            }
        }
        fetchUsers();
    }, [])

    return (
        <div>
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th
                            scope="col"
                            className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                        >
                            Name
                        </th>
                        <th
                            scope="col"
                            className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                        >
                            Gender
                        </th>
                        <th
                            scope="col"
                            className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                        >
                            State
                        </th>
                        <th
                            scope="col"
                            className="px-6 py-3 text-xs font-bold text-right text-gray-500 uppercase "
                        >
                            University
                        </th>
                        <th
                            scope="col"
                            className="px-6 py-3 text-xs font-bold text-right text-gray-500 uppercase "
                        >
                            Interests
                        </th>
                        <th
                            scope="col"
                            className="px-6 py-3 text-xs font-bold text-right text-gray-500 uppercase "
                        >
                            Status
                        </th>
                    </tr>
                </thead>
                <Suspense fallback={<TableSkeleton />}>

                    <tbody className="divide-y divide-gray-200">
                        {
                            users && (
                                users.map((user) => (
                                    <tr key={user.id} className={clsx(
                                        user.status === 'liked' ? 'bg-green-50' : 'bg-red-50'
                                    )}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{user.name}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{user.gender}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{user.location}</div>

                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="text-sm text-gray-900">{user.university}</div>

                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="text-sm text-gray-900">{user.interests.join(", ")}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="text-sm text-gray-900">{user.status}</div>
                                        </td>
                                    </tr>
                                ))
                            )
                        }
                        <tr>

                        </tr>

                    </tbody>
                </Suspense>
            </table>
        </div>
    );

}

export default TinderList;
