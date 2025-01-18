import React from 'react';
import { Typography } from 'antd';

interface Props {
    // Add any props that this component might need later
}

const SettingsTab: React.FC<Props> = () => {
    return (
        <div style={{ padding: '20px', backgroundColor: '#fff' }}>
            <Typography.Text>Settings Page Content Here</Typography.Text>
        </div>
    );
};

export default SettingsTab;