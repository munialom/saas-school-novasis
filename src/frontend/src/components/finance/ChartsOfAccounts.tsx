import React, { useState, useEffect } from 'react';
import {
    Card,
    Space,
    Button,
    Modal,
    Form,
    Input,
    Select,
    message,
    Switch,
    Checkbox,
    Row,
    Col
} from 'antd';
import {
    PlusOutlined
} from '@ant-design/icons';
import {
    ReportItem,
    AccountChartRequest,
    AccountGroupData
} from '../../lib/types';
import { getChartOfAccountsData, createAccountChart } from '../../lib/api';
import ChartsTable from '../ChartsTable';
import axios, { AxiosError } from 'axios';

const { Option } = Select;

interface ChartsOfAccountsProps {
}

// Define AccountGroup type to match AccountGroupData keys
type AccountGroup = keyof typeof AccountGroupData;

const ChartsOfAccounts: React.FC<ChartsOfAccountsProps> = () => {
    const [accounts, setAccounts] = useState<ReportItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [, setEditMode] = useState(false);
    const [, setSelectedAccount] = useState<ReportItem | null>(null);
    const [form] = Form.useForm();
    const [allOptions, setAllOptions] = useState<ReportItem[]>([]);
    const [, setBankAccountOptions] = useState<ReportItem[]>([]);
    const [deleting] = useState<Record<number, boolean>>({});
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const fetchAccounts = async () => {
        setLoading(true);
        try {
            const response = await getChartOfAccountsData();
            setAccounts(response.data);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError;
                message.error(`Failed to load accounts: ${axiosError.message}`);
            }
            else{
                message.error("Failed to load accounts.");
                console.error("Error fetching accounts:", error);
            }
            setAccounts([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchOptions = () => {
        const accountData = accounts;
        // Set all options
        setAllOptions(accountData);

        //Filter Bank Accounts
        const bankOptions = accountData.filter(account => account.IsBankAccount === "Yes");
        setBankAccountOptions(bankOptions);
    }


    useEffect(() => {
        fetchAccounts();
    }, [refreshTrigger]); // Refreshes when refreshTrigger changes

    useEffect(() => {
        fetchOptions()
    }, [accounts]);

    const showModal = () => {
        setModalVisible(true);
        setEditMode(false);
        setSelectedAccount(null);
        form.resetFields();
    };

    const handleCancel = () => {
        setModalVisible(false);
        form.resetFields()
    };

    const handleOk = async () => {
        try {
            await form.validateFields();
            const formData = form.getFieldsValue();
            const accountGroupEnumValue = formData.accountGroupEnum as AccountGroup;

            const requestData: AccountChartRequest = {
                name: formData.name,
                alias: formData.name,
                parentId: formData.parent,
                accountGroup: accountGroupEnumValue,
                bankAccount: formData.bankAccount,
                linkedBankAccountId: formData.linkedBankAccount,
                receivableAccountId: formData.receivableAccount,
                receivable: formData.receivable || false,
                payable: formData.payable || false
            };

            await createAccountChart(requestData);
            message.success('Account created successfully');
            setRefreshTrigger(prev => prev + 1);
            setModalVisible(false);
            form.resetFields();


        } catch (error) {
            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError;
                message.error(`Failed to save account: ${axiosError.response?.data || axiosError.message}`);
            }
            else{
                message.error("Failed to save account.");
                console.error("Error saving account:", error);
            }

        }
    };

    const getAccountLabel = (account: ReportItem) => {
        let statusText = "";
        if (account.IsReceivable === "Yes") {
            statusText = "(Receivable)";
        } else if (account.IsPayable === "Yes") {
            statusText = "(Payable)";
        }
        return `${account.AccountName} ${statusText}`;
    };


    const handleReceivableChange = (e: any) => {
        if (e.target.checked) {
            form.setFieldsValue({ payable: false });
        }
    };

    const handlePayableChange = (e: any) => {
        if (e.target.checked) {
            form.setFieldsValue({ receivable: false });
        }
    };

    return (
        <Card
            bordered={false}
            size="small"
            title={
                <Space style={{ justifyContent: 'space-between', width: '100%' }}>
                    <span style={{ fontSize: '1.2em', fontWeight: '500' }}>Chart of Accounts</span>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={showModal}
                    >
                        Add Account
                    </Button>
                </Space>
            }
            className="shadow-md"
            style={{ borderRadius: '8px' }}
        >
            <ChartsTable
                data={accounts}
                loading={loading}
                deleting={deleting}
            />

            <Modal
                title={'Add Account'}
                open={modalVisible}
                onCancel={handleCancel}
                onOk={handleOk}
                confirmLoading={loading}
            >
                <Form
                    form={form}
                    layout="vertical"
                >
                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[{ required: true, message: 'Please input account name' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Account Group"
                        name="accountGroupEnum"
                        rules={[{ required: true, message: 'Please select an account group' }]}
                    >
                        <Select
                            placeholder="Select an Account Group"
                        >
                            {(Object.entries(AccountGroupData) as [string, any][]).reduce((acc, [key, value]) => {
                                const existingParent = acc.find((item) => item.label === value.parentGroup);
                                if (existingParent) {
                                    existingParent.options.push({ label: value.displayText, value: key });
                                } else {
                                    acc.push({ label: value.parentGroup, options: [{ label: value.displayText, value: key }] });
                                }
                                return acc;
                            }, [] as { label: string; options: { label: string; value: string; }[] }[])
                                .map((group) => (
                                    <Select.OptGroup key={group.label} label={group.label} >
                                        {group.options.map((option) => (
                                            <Option key={option.value} value={option.value}>{option.label}</Option>
                                        ))}
                                    </Select.OptGroup>
                                ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="Parent Account"
                        name="parent"
                    >
                        <Select
                            placeholder="Select a Parent Account"
                            allowClear
                            options={allOptions.map(option => ({
                                label: getAccountLabel(option),
                                value: option.id,
                            }))}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Bank Account"
                        name="bankAccount"
                        valuePropName="checked"
                    >
                        <Switch />
                    </Form.Item>

                    <Form.Item
                        label="Receivable Account"
                        name="receivableAccount"
                    >
                        <Select
                            placeholder="Select a Receivable Account"
                            allowClear
                            disabled={form.getFieldValue('bankAccount')}
                            options={allOptions.map(option => ({
                                label: getAccountLabel(option),
                                value: option.id,
                            }))}
                        />
                    </Form.Item>
                    <Form.Item label="Account Type" >
                        <Row>
                            <Col span={12}>
                                <Form.Item
                                    name="receivable"
                                    valuePropName="checked"
                                >
                                    <Checkbox onChange={handleReceivableChange}>Is Receivable</Checkbox>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="payable"
                                    valuePropName="checked"
                                >
                                    <Checkbox onChange={handlePayableChange}>Is Payable</Checkbox>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form.Item>
                </Form>
            </Modal>
        </Card>
    );
};

export default ChartsOfAccounts;