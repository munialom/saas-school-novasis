/*
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

export default PageCrumbs;*/

import React from 'react';
import { Breadcrumb, Typography } from 'antd';
import { useLocation } from 'react-router-dom';

const { Text } = Typography;

const PageCrumbs: React.FC = () => {
    const location = useLocation();
    const pathSegments = location.pathname.split('/').filter(segment => segment);

    const breadcrumbItems = pathSegments.map((segment, index) => {
        const path = `/${pathSegments.slice(0, index + 1).join('/')}`;
        return {
            key: path,
            title: <Text style={{color: 'rgba(0,0,0,.65)'}}>{segment.charAt(0).toUpperCase() + segment.slice(1)}</Text>,
        };
    });

    return (
        <div style={{ padding: '10px 12px 0px',  }}>
            <Breadcrumb items={breadcrumbItems} />
        </div>
    );
};

export default PageCrumbs;