import { useState, useEffect } from 'react';
import { Card, Col, Row, Select, Button, Spin, Typography, Alert, Cascader } from 'antd';
import { FileTextOutlined, PrinterOutlined, EyeOutlined, DownloadOutlined } from '@ant-design/icons';
import { getClasses, getStreams, generateStudentReport } from '../../lib/api'; // Make sure the import is correct

const { Text, Title } = Typography;

interface ClassResponse {
    Id: number;
    ClassName: string;
}

interface StreamResponse {
    Id: number;
    StreamName: string;
}

interface FilterState {
    classId: number | null;
    streamId: number | null;
    admission: 'SESSION' | 'TRANSFER' | 'ALUMNI';
}

interface AlertState {
    type: 'success' | 'error' | null;
    message: string | null;
}

const ReportGenerator = () => {
    const [filters, setFilters] = useState<FilterState>({
        classId: null,
        streamId: null,
        admission: 'SESSION',
    });

    const [showPreview, setShowPreview] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [pdfUrl, setPdfUrl] = useState('');
    const [classOptions, setClassOptions] = useState<{ value: number; label: string; }[]>([]);
    const [streamOptions, setStreamOptions] = useState<{ value: number; label: string; }[]>([]);
    const [loadingData, setLoadingData] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [alert, setAlert] = useState<AlertState>({
        type: null,
        message: null
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [classesResponse, streamsResponse] = await Promise.all([
                    getClasses(),
                    getStreams(),
                ]);

                console.log("Classes response", classesResponse);
                console.log("Streams Response:", streamsResponse)

                if (classesResponse && classesResponse.data && Array.isArray(classesResponse.data)) {
                    const mappedClasses: { value: number, label: string }[] = classesResponse.data.map((cls: ClassResponse) => ({
                        value: cls.Id,
                        label: cls.ClassName,
                    }));
                    console.log("Mapped classes:", mappedClasses);
                    setClassOptions(mappedClasses);
                } else {
                    throw new Error("Classes data is not in the expected format.");
                }

                if (streamsResponse && streamsResponse.data && Array.isArray(streamsResponse.data)) {
                    const mappedStreams: { value: number, label: string }[] = streamsResponse.data.map((stream: StreamResponse) => ({
                        value: stream.Id,
                        label: stream.StreamName,
                    }));
                    console.log("Mapped streams:", mappedStreams);
                    setStreamOptions(mappedStreams);
                } else {
                    throw new Error("Streams data is not in the expected format.");
                }
            } catch (err: any) {
                setAlert({ type: 'error', message: `Failed to load data: ${err.message}` });
                setError(err.message);
            } finally {
                setLoadingData(false);
            }
        };

        fetchData();
    }, []);

    const handleFilterChange = (name: keyof FilterState, value: (string | number)[] | null) => {
        setFilters(prev => ({
            ...prev,
            [name]: value && value.length > 0 ? value[0] as number : null,
        }));
    };

    const onCloseAlert = () => {
        setAlert({ type: null, message: null });
    };

    const handleGenerateReport = async () => {
        setIsGenerating(true);
        setPdfUrl('');
        setShowPreview(false);

        try {
            const { classId, streamId, admission } = filters;
            if (!classId || !streamId) {
                setAlert({ type: 'error', message: 'Please select Class and Stream.' });
                return;
            }

            const response = await generateStudentReport(classId, streamId, admission);
            if (response && response.data) {
                const newPdfUrl = URL.createObjectURL(response.data);
                setPdfUrl(newPdfUrl);
                setShowPreview(true);
            } else {
                setAlert({ type: 'error', message: 'Failed to generate report. Response data was null' });
            }

        } catch (err: any) {
            setAlert({ type: 'error', message: `Failed to generate report: ${err.message || 'An unexpected error occurred'}` });

        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div style={{ padding: '20px' }}>
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
            <Row gutter={[24, 24]}> {/* Corrected gutter to accept [number, number] */}
                {/* Filters Panel */}
                <Col xs={24} md={8} lg={6} xl={5}>
                    <Card
                        title={
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <FileTextOutlined style={{ marginRight: '8px' }} />
                                Report Filters
                            </div>
                        }
                    >
                        {loadingData ? (
                            <div style={{ textAlign: 'center', padding: '20px' }}>
                                <Spin size="large" />
                            </div>
                        ) : error ? (
                            <Alert message={error} type="error" />
                        ) : (
                            <>
                                <div style={{ marginBottom: '16px' }}>
                                    <Row gutter={8} align="middle"> {/* Corrected gutter to accept a single number */}
                                        <Col span={24}>
                                            <Text>Class</Text>
                                        </Col>
                                        <Col span={24}>
                                            <Cascader
                                                style={{ width: '100%' }}
                                                placeholder="Select Class"
                                                value={filters.classId ? [filters.classId] : undefined}
                                                onChange={(value) => handleFilterChange('classId', value)}
                                                options={classOptions}
                                                getPopupContainer={(trigger) => trigger.parentNode}
                                            />
                                        </Col>
                                    </Row>
                                </div>
                                <div style={{ marginBottom: '16px' }}>
                                    <Row gutter={8} align="middle"> {/* Corrected gutter to accept a single number */}
                                        <Col span={24}>
                                            <Text>Stream</Text>
                                        </Col>
                                        <Col span={24}>
                                            <Cascader
                                                style={{ width: '100%' }}
                                                placeholder="Select Stream"
                                                value={filters.streamId ? [filters.streamId] : undefined}
                                                onChange={(value) => handleFilterChange('streamId', value)}
                                                options={streamOptions}
                                                getPopupContainer={(trigger) => trigger.parentNode}
                                            />
                                        </Col>
                                    </Row>
                                </div>
                                <div style={{ marginBottom: '16px' }}>
                                    <Row gutter={8} align="middle"> {/* Corrected gutter to accept a single number */}
                                        <Col span={24}>
                                            <Text>Admission Type</Text>
                                        </Col>
                                        <Col span={24}>
                                            <Select
                                                style={{ width: '100%' }}
                                                value={filters.admission}
                                                onChange={(value: 'SESSION' | 'TRANSFER' | 'ALUMNI') => handleFilterChange('admission', [value])}
                                            >
                                                <Select.Option value="SESSION">Session</Select.Option>
                                                <Select.Option value="TRANSFER">Transfer</Select.Option>
                                                <Select.Option value="ALUMNI">Alumni</Select.Option>
                                            </Select>
                                        </Col>
                                    </Row>
                                </div>
                                <Button
                                    type="primary"
                                    block
                                    onClick={handleGenerateReport}
                                    disabled={isGenerating}
                                    icon={<EyeOutlined />}
                                    style={{ marginTop: '16px' }}
                                >
                                    {isGenerating ? <Spin size="small">Generating</Spin> : 'Generate Preview'}
                                </Button>
                            </>
                        )}
                    </Card>
                </Col>

                {/* PDF Preview Panel */}
                <Col xs={24} md={16} lg={18} xl={19}>
                    <Card
                        title={
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Title level={5} style={{ margin: 0 }}>
                                    Report Preview
                                </Title>
                                {showPreview && (
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <Button icon={<PrinterOutlined />} size="small" type="dashed" onClick={() => window.print()}>
                                            Print
                                        </Button>
                                        <Button
                                            icon={<DownloadOutlined />}
                                            size="small"
                                            type="dashed"
                                            onClick={() => {
                                                const link = document.createElement('a');
                                                link.href = pdfUrl;
                                                link.download = 'report.pdf';
                                                document.body.appendChild(link);
                                                link.click();
                                                document.body.removeChild(link);
                                                URL.revokeObjectURL(pdfUrl);
                                            }}
                                        >
                                            Download PDF
                                        </Button>
                                    </div>
                                )}
                            </div>
                        }
                    >
                        {!showPreview ? (
                            <div
                                style={{
                                    height: '400px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: '2px dashed #ccc',
                                    borderRadius: '8px',
                                }}
                            >
                                <div style={{ textAlign: 'center', color: '#999' }}>
                                    <FileTextOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
                                    <p>Generate a report to see preview</p>
                                </div>
                            </div>
                        ) : (

                            <div style={{ height: '600px' }}>
                                <iframe
                                    src={pdfUrl}
                                    title="PDF Preview"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 'none', borderRadius: '8px', backgroundColor: '#fff' }}
                                />
                            </div>
                        )}
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default ReportGenerator;