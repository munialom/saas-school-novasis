import React, { useState, useEffect } from 'react';
import {
    Card,
    Row,
    Col,
    Form,
    Input,
    Button,
    List,
    Space,
    Cascader,
    Alert as AntdAlert,
    Descriptions,
    Divider
} from 'antd';
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
    const [parents, setParents] = useState<{
        parentType: 'MOTHER' | 'FATHER' | 'GUARDIAN';
        parentDetails: ParentDetails
    }[]>([]);
    const [existingParentsData, setExistingParentsData] = useState<ParentResponse[] | null>(null);


    useEffect(() => {
        const fetchParentsData = async () => {
            if (studentId) {
                try {
                    const response = await getStudentParents(studentId);
                    console.log("API Response:", response); // Log the raw response
                    if (response && response.data) {
                        if (Array.isArray(response.data)) {
                            console.log("API Response Data (Array):", response.data);
                            setExistingParentsData(response.data);
                        } else {
                            console.log("API Response Data (Single):", response.data);
                            setExistingParentsData([response.data])
                        }
                    }
                    else {
                        setExistingParentsData(null);
                        console.log("API Response No Data:", response);
                    }
                } catch (error) {
                    console.log('Error fetching parents data:', error)
                    setAlert({ type: 'error', message: 'Failed to load existing parents' })
                    setExistingParentsData(null)
                }
            }

        };

        fetchParentsData();
    }, [studentId, setAlert]);

    useEffect(() => {
        console.log("Existing Parents Data:", existingParentsData);

        if (existingParentsData) {
            try {
                const initialParents = existingParentsData.map((parent) => {
                    let parentDetails: ParentDetails | string = parent.parentDetails;
                    console.log("Processing Parent:", parent);
                    console.log("Initial Parent Details:", parentDetails);

                    if (typeof parentDetails === 'string') {
                        try {
                            //remove the backslashes so that we can convert to JSON object
                            const parsedParentDetails = JSON.parse(parentDetails.replace(/\\/g, '')) as ParentDetails;
                            console.log("Parsed Parent Details:", parsedParentDetails);
                            parentDetails = parsedParentDetails
                        } catch (e) {
                            console.log("error converting stringified json", e);
                            parentDetails = {
                                fullName: "",
                                phoneNumbers: [],
                                emailAddress: ""
                            }
                            console.log("Defaulted Parent Details:", parentDetails);
                        }
                    }
                    console.log("Final Parent Details:", parentDetails);


                    return {
                        parentType: parent.parentType,
                        parentDetails: parentDetails as ParentDetails
                    }

                })
                setParents(initialParents);
                console.log("Final Parsed Parents:", initialParents);


            } catch (e) {
                console.log("could not process data", e)
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
            const parentData = parents.map((parent) => ({
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


    return (
        <Card title="Parents Details">
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
                <Card title="Add Parent Details" style={{ marginBottom: 20 }}>
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
                                                    <Space key={phoneIndex} style={{ alignItems: "center" }}>
                                                        <Input
                                                            placeholder="Enter phone number"
                                                            value={phone}
                                                            onChange={(e) => handleParentDetailsChange(index, 'phoneNumbers', item.parentDetails.phoneNumbers.map((p, i) => i === phoneIndex ? e.target.value : p))}
                                                            style={{ flex: 1 }}
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
                    <Button type="dashed" onClick={handleAddParent} style={{ width: '100%', marginTop: 10 }} icon={<PlusOutlined />} >
                        Add Parent Data
                    </Button>
                    <Form.Item style={{ marginTop: 16 }}>
                        {parents.length > 0 && (
                            <Button type="primary" onClick={handleSaveParents} loading={loading} style={{ marginTop: 16 }}>
                                Save Parents
                            </Button>
                        )}
                    </Form.Item>
                </Card>
                <Divider dashed />

                {existingParentsData && existingParentsData.length > 0 && (
                    <Card title="Existing Parent Details">
                        <List
                            dataSource={existingParentsData.map(parent => ({
                                ...parent,
                                parentDetails: typeof parent.parentDetails === 'string' ? JSON.parse(parent.parentDetails.replace(/\\/g, '')) as ParentDetails : parent.parentDetails as ParentDetails,
                            }))}
                            renderItem={(item: ParentResponse & { parentDetails: ParentDetails }) => {
                                console.log("Rendering Existing Parent Item:", item)
                                return (
                                    <List.Item key={item.id}>
                                        <Descriptions title={`${item.parentType} Information`} layout="vertical" >
                                            <Descriptions.Item label="Full Name">
                                                {item.parentDetails?.fullName || 'N/A'}
                                            </Descriptions.Item>
                                            <Descriptions.Item label="Phone Numbers">
                                                {item.parentDetails?.phoneNumbers?.join(', ') || 'N/A'}
                                            </Descriptions.Item>
                                            <Descriptions.Item label="Email Address">
                                                {item.parentDetails?.emailAddress || 'N/A'}
                                            </Descriptions.Item>
                                        </Descriptions>
                                    </List.Item>
                                )
                            }}

                        />
                    </Card>
                )}

            </Form>
        </Card>
    );
};

export default ParentsTab;