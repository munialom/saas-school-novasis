import React from 'react';
import { Card, Row, Col, Form, Input, Button, List, Space, Cascader } from 'antd';
import { ParentDetails } from '../../../lib/types';
import { PlusOutlined } from '@ant-design/icons';

interface ParentsTabProps {
    parents: {
        parentType: 'MOTHER' | 'FATHER' | 'GUARDIAN';
        parentDetails: ParentDetails
    }[];
    loading: boolean;
    parentForm: any
    handleParentDetailsChange: (index: number, field: string, value: any) => void;
    handleParentTypeChange: (index: number, value: any) => void;
    addPhoneNumber: (index: number) => void;
    handleRemovePhone: (parentIndex: number, phoneIndex: number) => void;
    handleSaveParents: () => void;
    handleAddParent: () => void;
    handleRemoveParent: (index: number) => void;
}

const ParentsTab: React.FC<ParentsTabProps> = ({
                                                   parents,
                                                   loading,
                                                   parentForm,
                                                   handleParentDetailsChange,
                                                   handleParentTypeChange,
                                                   addPhoneNumber,
                                                   handleRemovePhone,
                                                   handleSaveParents,
                                                   handleAddParent,
                                                   handleRemoveParent
                                               }) => {
    return (
        <Card title="Add Parents Details" >
            <Form
                form={parentForm}
                layout="vertical"
            >
                <List
                    dataSource={parents}
                    renderItem={(item, index) => (
                        <List.Item
                            key={index}
                            actions={[
                                <Button
                                    type="text"
                                    key="remove"
                                    onClick={() => handleRemoveParent(index)}
                                >
                                    Remove
                                </Button>
                            ]}
                        >
                            <Row gutter={16} style={{ width: '100%' }}>
                                <Col span={8}>
                                    <Form.Item
                                        label="Parent Type"
                                        rules={[{ required: true, message: 'Please select parent type' }]}
                                    >
                                        <Cascader
                                            options={[
                                                { value: 'MOTHER', label: 'Mother' },
                                                { value: 'FATHER', label: 'Father' },
                                                { value: 'GUARDIAN', label: 'Guardian' }
                                            ]}
                                            placeholder="Select parent type"
                                            onChange={(value) => handleParentTypeChange(index, value ? value[0] : null)}
                                            value={[item.parentType]}
                                        />

                                    </Form.Item>
                                </Col>
                                <Col span={16}>
                                    <Form.Item
                                        label="Full Name"
                                        rules={[{ required: true, message: 'Please enter parent full name' }]}
                                    >
                                        <Input
                                            placeholder="Enter full name"
                                            value={item.parentDetails.fullName}
                                            onChange={(e) => handleParentDetailsChange(index, 'fullName', e.target.value)}
                                        />
                                    </Form.Item>
                                </Col>

                            </Row>
                            <Row gutter={16} style={{ width: '100%' }}>
                                <Col span={24}>
                                    <Form.Item
                                        label="Phone Numbers"
                                        rules={[{ required: true, message: 'Please enter phone number' }]}
                                    >
                                        <Space direction="vertical" style={{ width: '100%' }}>
                                            {item.parentDetails.phoneNumbers.map((phone, phoneIndex) => (
                                                <Space key={phoneIndex} >
                                                    <Input
                                                        placeholder="Enter phone number"
                                                        value={phone}
                                                        onChange={(e) => handleParentDetailsChange(index, 'phoneNumbers', item.parentDetails.phoneNumbers.map((p, i) => i === phoneIndex ? e.target.value : p))}
                                                    />
                                                    <Button type='text' onClick={() => handleRemovePhone(index, phoneIndex)} >Remove</Button>
                                                </Space>
                                            ))}
                                            <Button type='dashed' onClick={() => addPhoneNumber(index)} style={{ width: '100%' }}> <PlusOutlined /> Add Phone </Button>
                                        </Space>
                                    </Form.Item>
                                </Col>

                            </Row>
                            <Row gutter={16} style={{ width: '100%' }}>
                                <Col span={24}>
                                    <Form.Item
                                        label="Email Address"
                                        rules={[{ required: false, message: 'Please enter email address' }]}
                                    >
                                        <Input
                                            placeholder="Enter email address"
                                            value={item.parentDetails.emailAddress}
                                            onChange={(e) => handleParentDetailsChange(index, 'emailAddress', e.target.value)}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </List.Item>
                    )}
                />
                <Button type="dashed" onClick={handleAddParent} style={{ width: '100%' }} icon={<PlusOutlined />}>
                    Add Parent Data
                </Button>
                <Form.Item>
                    {parents.length > 0 && (
                        <Button type="primary" onClick={handleSaveParents} loading={loading} style={{ marginTop: 16 }}>
                            Save Parents
                        </Button>
                    )}
                </Form.Item>
            </Form>
        </Card>
    );
};

export default ParentsTab;