import React from 'react';
import SideNav from '../../components/SideNav';

const Layout = ({ children }: { children: any }) => {
    return (
        <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
            <SideNav />
            <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
        </div>
    );
};

export default Layout;