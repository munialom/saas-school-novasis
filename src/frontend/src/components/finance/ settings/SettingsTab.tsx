import React from 'react';
import { Card, Typography } from 'antd';
const { Text } = Typography;

const SettingsTab: React.FC = () => {
    return (
        <Card title="Settings">
            <Text> This is the Settings Tab. </Text>
        </Card>
    );
};

export default SettingsTab;