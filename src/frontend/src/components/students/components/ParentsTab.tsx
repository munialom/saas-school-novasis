import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Form, Input, Button, List, Space, Cascader, Alert as AntdAlert, Descriptions } from 'antd';
import { ParentDetails, ParentResponse } from '../../../lib/types';
import { PlusOutlined } from '@ant-design/icons';
import { saveParents, getStudentParents } from '../../../lib/api';


interface ParentsTabProps {
    studentId: number | undefined
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    parentForm: any
    setAlert: React.Dispatch<React.SetStateAction<{
        type: 'success' | 'error' | null;
        message: string | null;
    }>>;
    alert: { type: 'success' | 'error' | null, message: string | null }
}

const ParentsTab: React.FC<ParentsTabProps> = ({
                                                   studentId,
                                                   loading,
                                                   setLoading,
                                                   parentForm,
                                                   setAlert,
                                                   alert,
                                               }) => {
    const [parents, setParents] = useState< {
        parentType: 'MOTHER' | 'FATHER' | 'GUARDIAN';
        parentDetails: ParentDetails
    }[]>([]);
    const [existingParentsData, setExistingParentsData] = useState<ParentResponse[] | null>(null);

    useEffect(() => {
        const fetchParentsData = async () => {
            if(studentId){
                try {
                    const response = await getStudentParents(studentId);
                    if (response && response.data) {
                        if(Array.isArray(response.data)){
                            setExistingParentsData(response.data);
                        } else {
                            setExistingParentsData([response.data])
                        }
                    }
                    else {
                        setExistingParentsData(null);
                    }
                } catch (error) {
                    console.log('Error fetching parents data:', error)
                    setAlert({type: 'error', message: 'Failed to load existing parents'})
                    setExistingParentsData(null)
                }
            }

        };

        fetchParentsData();
    }, [studentId,setAlert]);

    useEffect(() => {
        if(existingParentsData) {
            try {
                const initialParents = existingParentsData.map((parent) => ({
                    parentType: parent.parentType,
                    parentDetails:  typeof parent.parentDetails === 'string' ? JSON.parse(parent.parentDetails) as ParentDetails : parent.parentDetails as ParentDetails
                }))
                setParents(initialParents);

            } catch (e){
                console.log("could not process data")
                setAlert({ type: 'error', message: 'Could not process parents data' });
                setExistingParentsData(null)
            }


        }

    }, [existingParentsData, setAlert]);

    const handleParentDetailsChange = (index: number, field: string, value: any) => {
        setParents(prevParents => {
            const updatedParents = [...prevParents];
            if (field === 'phoneNumbers') {
                updatedParents[index].parentDetails.phoneNumbers = value;
            } else {
                updatedParents[index].parentDetails = {
                    ...updatedParents[index].parentDetails,
                    [field]: value
                };
            }
            return updatedParents;
        });
    };

    const handleParentTypeChange = (index: number, value: any) => {
        setParents(prevParents => {
            const updatedParents = [...prevParents];
            updatedParents[index] = {
                ...updatedParents[index],
                parentType: value
            };
            return updatedParents;
        });
    };

    const addPhoneNumber = (index: number) => {
        setParents(prevParents => {
            const updatedParents = [...prevParents];
            updatedParents[index].parentDetails.phoneNumbers.push("");
            return updatedParents;
        });
    };

    const handleRemovePhone = (parentIndex: number, phoneIndex: number) => {
        setParents(prevParents => {
            const updatedParents = [...prevParents];
            updatedParents[parentIndex].parentDetails.phoneNumbers.splice(phoneIndex, 1);
            return updatedParents;
        });
    };

    const handleSaveParents = async () => {
        setLoading(true)
        try {
            const parentData = parents.map((parent)=> ({
                    parentType: parent.parentType,
                    parentDetails: JSON.stringify(parent.parentDetails),
                    studentId: studentId
                }
            ))
            await saveParents(parentData);
            setAlert({ type: 'success', message: 'Parents details saved successfully' });
        } catch (error) {
            console.log(error)
            setAlert({ type: 'error', message: 'Failed to save parents, please check input' });
        } finally {
            setLoading(false);
        }
    };

    const handleAddParent = () => {
        setParents(prevParents => [...prevParents, {
            parentType: "MOTHER",
            parentDetails: {
                fullName: "",
                phoneNumbers: [""],
                emailAddress: "",
            }
        }]);
    };

    const handleRemoveParent = (index: number) => {
        setParents(prevParents => {
            const updatedParents = [...prevParents];
            updatedParents.splice(index, 1);
            return updatedParents;
        });
    };

    const onCloseAlert = () => {
        setAlert({ type: null, message: null });
    };
    const renderParentData = () => {
        if (!existingParentsData || existingParentsData.length === 0) {
            return (
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
                            <Row gutter={[16, 16]} style={{ width: '100%' }}>
                                <Col span={6}>
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
                                <Col span={6}>
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
                                <Col span={6}>
                                    <Form.Item
                                        label="Phone Numbers"
                                        rules={[{ required: true, message: 'Please enter phone number' }]}
                                    >
                                        <Space direction="vertical" style={{ width: '100%' }}>
                                            {item.parentDetails.phoneNumbers.map((phone, phoneIndex) => (
                                                <Space key={phoneIndex} style={{alignItems: "center"}}>
                                                    <Input
                                                        placeholder="Enter phone number"
                                                        value={phone}
                                                        onChange={(e) => handleParentDetailsChange(index, 'phoneNumbers', item.parentDetails.phoneNumbers.map((p, i) => i === phoneIndex ? e.target.value : p))}
                                                        style={{flex:1}}
                                                    />
                                                    <Button type='text' onClick={() => handleRemovePhone(index, phoneIndex)} >Remove</Button>
                                                </Space>
                                            ))}
                                            <Button type='dashed' onClick={() => addPhoneNumber(index)} style={{ width: '100%' }}> <PlusOutlined /> Add Phone </Button>
                                        </Space>
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
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
            )
        } else {

            return (
                <List
                    dataSource={existingParentsData}
                    renderItem={(item) => (
                        <List.Item key={item.id}>
                            <Descriptions title={`${item.parentType} Information`} layout="vertical" >
                                <Descriptions.Item label="Full Name">
                                    {item.parentDetails &&  (typeof item.parentDetails === 'string' ? (JSON.parse(item.parentDetails) as ParentDetails).fullName : (item.parentDetails as ParentDetails).fullName) || 'N/A'}
                                </Descriptions.Item>
                                <Descriptions.Item label="Phone Numbers">
                                    {item.parentDetails && (typeof item.parentDetails === 'string' ? (JSON.parse(item.parentDetails) as ParentDetails).phoneNumbers?.join(', ') || 'N/A' : (item.parentDetails as ParentDetails).phoneNumbers?.join(', ') || 'N/A') }
                                </Descriptions.Item>
                                <Descriptions.Item label="Email Address">
                                    {item.parentDetails && ( typeof item.parentDetails === 'string' ? (JSON.parse(item.parentDetails) as ParentDetails).emailAddress || 'N/A' : (item.parentDetails as ParentDetails).emailAddress || 'N/A')}
                                </Descriptions.Item>
                            </Descriptions>
                        </List.Item>
                    )}
                />
            )
        }
    }
    return (
        <Card title="Add Parents Details">
            {
                alert.type && alert.message && (
                    <AntdAlert
                        message={alert.message}
                        type={alert.type}
                        showIcon
                        closable
                        onClose={onCloseAlert}
                        style={{ marginBottom: 16 }}
                    />
                )
            }
            <Form
                form={parentForm}
                layout="vertical"
            >
                {renderParentData()}
                {!existingParentsData || existingParentsData.length === 0 ? (
                    <>
                        <Button type="dashed" onClick={handleAddParent} style={{ width: '100%' }} icon={<PlusOutlined/>}>
                            Add Parent Data
                        </Button>
                        <Form.Item>
                            {parents.length > 0 && (
                                <Button type="primary" onClick={handleSaveParents} loading={loading} style={{ marginTop: 16 }}>
                                    Save Parents
                                </Button>
                            )}
                        </Form.Item>
                    </>
                ) : null}

            </Form>
        </Card>
    );
};

export default ParentsTab;