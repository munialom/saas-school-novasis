import React, { useState, useEffect } from 'react';
import {
    Layout,
    Flex,
    Select,
    Alert,
    message,
    Button,
    Progress
} from 'antd';
import { Card as AntdCard } from 'antd';
import { getClasses, promoteStudentsApi } from '../../lib/api';
import { PromotionDTO } from "../../lib/types";
import PopConfirmComponent from "../../utils/ui/PopConfirm.tsx";
import Loading from "../../utils/ui/Loading.tsx";

const { Content } = Layout;

interface AlertState {
    type: 'success' | 'error' | null;
    message: string | null;
}

const StudentPromotion: React.FC = () => {
    const [classOptions, setClassOptions] = useState<any[]>([]);
    const [currentClass, setCurrentClass] = useState<number>();
    const [nextClass, setNextClass] = useState<number>();
    const [opcode, setOpcode] = useState<'Promote' | 'Alumni'>('Promote');
    const [alert, setAlert] = useState<AlertState>({ type: null, message: null });
    const [loading, setLoading] = useState(false);
    const [promotionProgress, setPromotionProgress] = useState(0);

    useEffect(() => {
        const fetchClassData = async () => {
            try {
                const response = await getClasses();
                if (response?.data && Array.isArray(response.data)) {
                    const formattedClasses = response.data.map((item: any) => ({
                        value: item.Id,
                        label: item.ClassName,
                    }));
                    setClassOptions(formattedClasses);
                } else {
                    setAlert({ type: 'error', message: 'Failed to load classes.' });
                }
            } catch (error) {
                console.error("Error fetching classes:", error);
                setAlert({ type: 'error', message: 'Failed to load classes.' });
            }
        };
        fetchClassData();
    }, []);

    const onCloseAlert = () => {
        setAlert({ type: null, message: null });
    };

    const handleCurrentClassChange = (value: number) => {
        setCurrentClass(value);
    };

    const handleNextClassChange = (value: number) => {
        setNextClass(value);
    };

    const handleOpcodeChange = (value: 'Promote' | 'Alumni') => {
        setOpcode(value);
        setNextClass(undefined); // Reset next class when opcode changes
    };

    const handlePromoteStudents = async () => {
        if (!currentClass) {
            message.error('Please select the current class.');
            return;
        }
        if (opcode === 'Promote' && !nextClass) {
            message.error('Please select the next class for promotion.');
            return;
        }

        const promotionDTO: PromotionDTO = {
            currentClassId: currentClass,
            nextClassId: opcode === 'Promote' && nextClass !== undefined ? nextClass : null,
            opcode: opcode.toUpperCase() as 'PROMOTE' | 'ALUMNI',
        };

        setLoading(true);
        setPromotionProgress(0);

        try {
            // Simulate progress updates (replace with actual SSE implementation)
            const totalSteps = 100; // Example: 100 students
            for (let i = 0; i <= totalSteps; i++) {
                await new Promise(resolve => setTimeout(resolve, 50)); // Simulate delay
                setPromotionProgress(Math.min((i / totalSteps) * 100, 100));
            }

            await promoteStudentsApi(promotionDTO);
            message.success(`Students marked as ${opcode === 'Promote' ? 'Promoted' : 'Alumni'} successfully!`);
            // Reset selections after successful promotion
            setCurrentClass(undefined);
            setNextClass(undefined);
        } catch (error: any) {
            message.error(error?.response?.data?.message || `Failed to mark students as ${opcode === 'Promote' ? 'Promoted' : 'Alumni'}.`);
        } finally {
            setLoading(false);
        }
    };

    const isPromoteDisabled = !currentClass || (opcode === 'Promote' && !nextClass);

    return (
        <Content style={{ padding: '20px', backgroundColor: '#fff', minHeight: '100vh' }}>
            {loading && <Loading />}
            {alert.type && alert.message && (
                <Alert
                    message={alert.message}
                    type={alert.type}
                    showIcon
                    closable
                    onClose={onCloseAlert}
                    style={{ marginBottom: 16 }}
                />
            )}
            <AntdCard title="Student Promotion" bordered={false}>
                <Flex vertical gap="middle">
                    <Select
                        placeholder="Select Current Class"
                        options={classOptions}
                        style={{ width: 300 }}
                        onChange={handleCurrentClassChange}
                        value={currentClass}
                    />

                    <Select
                        placeholder={opcode === 'Promote' ? "Select Next Class" : "No Next Class"}
                        options={classOptions}
                        style={{ width: 300 }}
                        onChange={handleNextClassChange}
                        disabled={opcode === 'Alumni'}
                        value={nextClass}
                    />

                    <Select
                        placeholder="Select Action"
                        style={{ width: 300 }}
                        onChange={handleOpcodeChange}
                        value={opcode}
                        options={[
                            { value: 'Promote', label: 'Promote' },
                            { value: 'Alumni', label: 'Mark as Alumni' },
                        ]}
                    />

                    {loading && <Progress percent={promotionProgress} status="active" />}

                    <PopConfirmComponent
                        title={`Are you sure you want to mark students of ${classOptions.find(opt => opt.value === currentClass)?.label} as ${opcode === 'Promote' ? `Promoted to ${classOptions.find(opt => opt.value === nextClass)?.label}` : 'Alumni'}?`}
                        onConfirm={handlePromoteStudents}
                        okText="Yes"
                        cancelText="No"
                        disabled={isPromoteDisabled}
                    >
                        <Button
                            type="primary"
                            disabled={isPromoteDisabled}
                            loading={loading}
                        >
                            {opcode === 'Promote' ? 'Promote Students' : 'Mark as Alumni'}
                        </Button>
                    </PopConfirmComponent>
                </Flex>
            </AntdCard>
        </Content>
    );
};

export default StudentPromotion;