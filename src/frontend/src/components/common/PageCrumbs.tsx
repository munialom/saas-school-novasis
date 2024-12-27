import React from 'react';
import { Breadcrumb } from 'antd';
import { useLocation } from 'react-router-dom';

const PageCrumbs: React.FC = () => {
    const location = useLocation();
    const pathSegments = location.pathname.split('/').filter(segment => segment);

    const breadcrumbItems = pathSegments.map((segment, index) => {
        const path = `/${pathSegments.slice(0, index + 1).join('/')}`;
        return {
            key: path,
            title: segment.charAt(0).toUpperCase() + segment.slice(1),
        };
    });

    return (
        <Breadcrumb style={{ margin: '16px 0' }} items={breadcrumbItems} />
    );
};

export default PageCrumbs;