import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, message, Space, Card, Divider } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

/**
 * Custom hook to detect device type (mobile, tablet, desktop).
 */
function useDeviceType() {
  const [deviceType, setDeviceType] = useState({
    isMobile: window.innerWidth <= 768,
    isTablet: window.innerWidth > 768 && window.innerWidth <= 1024,
  });

  useEffect(() => {
    const handleResize = () => {
      setDeviceType({
        isMobile: window.innerWidth <= 768,
        isTablet: window.innerWidth > 768 && window.innerWidth <= 1024,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return deviceType;
}

/**
 * TourInquiries component: Fetches and displays inquiries in both
 * a table (desktop) and card (mobile/tablet) view. Allows replying
 * to and deleting each inquiry.
 */
const TourInquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [replyModalVisible, setReplyModalVisible] = useState(false);
  const [currentInquiry, setCurrentInquiry] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [subject, setSubject] = useState('');

  // Use the custom hook to determine device type
  const { isMobile, isTablet } = useDeviceType();
  const isDesktop = !isMobile && !isTablet;

  useEffect(() => {
    fetchInquiries();
  }, []);

  // Fetch inquiries from the backend
  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/inquiries');
      if (!response.ok) throw new Error('Failed to fetch inquiries.');
      const data = await response.json();

      // Transform data if needed (handle _id and travel_date)
      const transformed = data.map((item) => ({
        ...item,
        _id: item._id?.$oid || item._id,
        travel_date: item.travel_date ? new Date(item.travel_date) : null,
      }));

      setInquiries(transformed);
    } catch (error) {
      console.error('Error fetching inquiries:', error);
      message.error(error.message || 'Failed to fetch inquiries.');
    } finally {
      setLoading(false);
    }
  };

  // Delete an inquiry
  const deleteInquiry = async (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this inquiry?');
    if (!confirmed) return;

    try {
      const response = await fetch(`/api/inquiries/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete inquiry.');
      message.success('Inquiry deleted successfully.');
      fetchInquiries();
    } catch (error) {
      console.error('Error deleting inquiry:', error);
      message.error(error.message || 'Failed to delete inquiry.');
    }
  };

  // Send reply to an inquiry
  const handleSendReply = async () => {
    if (!currentInquiry || !replyMessage) {
      message.error('Reply message cannot be empty.');
      return;
    }

    try {
      const response = await fetch('/api/inquiries/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inquiryId: currentInquiry._id,
          email: currentInquiry.email,
          subject: subject || `Reply to: ${currentInquiry.name}`,
          replyMessage,
        }),
      });

      if (!response.ok) throw new Error('Failed to send reply.');
      message.success('Reply sent successfully.');
      setReplyModalVisible(false);
      setReplyMessage('');
      setSubject('');
      fetchInquiries();
    } catch (error) {
      console.error('Error sending reply:', error);
      message.error(error.message || 'Failed to send reply.');
    }
  };

  // View reply details
  const handleViewReply = (record) => {
    if (!record.reply) {
      message.info('No reply has been sent for this inquiry.');
      return;
    }

    const sentAt = record.reply.sentAt ? new Date(record.reply.sentAt) : null;
    const formattedDate = sentAt && !isNaN(sentAt) ? sentAt.toLocaleString() : 'Invalid Date';

    Modal.info({
      title: `Reply to ${record.name}`,
      content: (
        <div>
          <p><strong>Subject:</strong> {record.reply.subject}</p>
          <p><strong>Message:</strong> {record.reply.message}</p>
          <p><strong>Sent On:</strong> {formattedDate}</p>
        </div>
      ),
    });
  };

  /**
   * Table columns for desktop view.
   * Align each column to the center for consistency.
   */
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      align: 'center',
    },
    {
      title: 'Phone Number',
      dataIndex: 'phone_number',
      key: 'phone_number',
      align: 'center',
      render: (phone) => phone || 'N/A',
    },
    {
      title: 'Travel Date',
      dataIndex: 'travel_date',
      key: 'travel_date',
      align: 'center',
      render: (date) => (date ? date.toLocaleDateString() : 'N/A'),
    },
    {
      title: 'Traveller Count',
      dataIndex: 'traveller_count',
      key: 'traveller_count',
      align: 'center',
      render: (count) => count || 'N/A',
    },
    {
      title: 'Message',
      dataIndex: 'message',
      key: 'message',
      align: 'center',
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'center',
      render: (_, record) => {
        // Highlight the 'Reply' button if there is no reply
        const replyButtonStyle = !record.reply
          ? { backgroundColor: 'blue', color: '#fff' }
          : {};

        // Highlight the 'View Reply' button if there is a reply
        const viewReplyButtonStyle = record.reply
          ? { backgroundColor: 'blue', color: '#fff' }
          : {};

        return (
          <Space>
            <Button
              type="primary"
              style={replyButtonStyle}
              onClick={() => {
                setCurrentInquiry(record);
                setReplyModalVisible(true);
              }}
            >
              Reply
            </Button>
            <Button
              type="primary"
              style={viewReplyButtonStyle}
              onClick={() => handleViewReply(record)}
            >
              View Reply
            </Button>
            <Button
              icon={<DeleteOutlined />}
              style={{ border: '1px solid red', color: 'red' }}
              onClick={() => deleteInquiry(record._id)}
            />
          </Space>
        );
      },
    },
  ];

  /**
   * Render mobile/tablet cards instead of a table.
   */
  const renderMobileCards = () => {
    return (
      <>
        {inquiries.map((inquiry) => {
          // Highlight the 'Reply' button if there's no existing reply
          const replyButtonStyle = !inquiry.reply
            ? { backgroundColor: 'blue', color: '#fff' }
            : {};
          // Highlight the 'View Reply' button if there's an existing reply
          const viewReplyButtonStyle = inquiry.reply
            ? { backgroundColor: 'blue', color: '#fff' }
            : {};

          const formattedTravelDate = inquiry.travel_date
            ? inquiry.travel_date.toLocaleDateString()
            : 'N/A';

          return (
            <Card
              key={inquiry._id}
              style={{ marginBottom: 16, backgroundColor: '#f0f0f0', paddingTop: 8 }}
              bodyStyle={{ padding: '0 24px 24px 24px' }}
              title={(
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <strong>Name:</strong> {inquiry.name}
                  <strong>Email:</strong> {inquiry.email}
                  <strong>Phone:</strong> {inquiry.phone_number || 'N/A'}
                </div>
              )}
            >
              <Divider style={{ margin: '12px 0' }} />
              <p><strong>Travel Date:</strong> {formattedTravelDate}</p>
              <p><strong>Traveller Count:</strong> {inquiry.traveller_count || 'N/A'}</p>
              <p><strong>Message:</strong> {inquiry.message}</p>

              <Divider />

              <Space style={{ padding: '0 15%' }}>
                <Button
                  type="primary"
                  style={replyButtonStyle}
                  onClick={() => {
                    setCurrentInquiry(inquiry);
                    setReplyModalVisible(true);
                  }}
                >
                  Reply
                </Button>
                <Button
                  type="primary"
                  style={viewReplyButtonStyle}
                  onClick={() => handleViewReply(inquiry)}
                >
                  View Reply
                </Button>
                <Button
                  icon={<DeleteOutlined />}
                  style={{ border: '1px solid red', color: 'red' }}
                  onClick={() => deleteInquiry(inquiry._id)}
                />
              </Space>
            </Card>
          );
        })}
      </>
    );
  };

  return (
    <div>
      <h2 className="text-5xl font-bold text-center mb-8">Tour Inquiries</h2>
      <Button
        type="primary"
        onClick={fetchInquiries}
        disabled={loading}
        style={{ marginBottom: '20px' }}
      >
        {loading ? 'Reloading...' : 'Reload Inquiries'}
      </Button>

      {isDesktop ? (
        // DESKTOP VIEW: show Table
        <Table
          dataSource={inquiries}
          columns={columns}
          rowKey="_id"
          loading={loading}
          pagination={{ pageSize: 6 }}
        />
      ) : (
        // MOBILE/TABLET VIEW: show Card layout
        renderMobileCards()
      )}

      <Modal
        title={`Reply to ${currentInquiry?.name}`}
        visible={replyModalVisible}
        onCancel={() => setReplyModalVisible(false)}
        onOk={handleSendReply}
        okText="Send Reply"
      >
        <Form layout="vertical">
          <Form.Item label="Subject">
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Subject of the reply"
            />
          </Form.Item>
          <Form.Item label="Reply Message">
            <Input.TextArea
              rows={4}
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              placeholder="Type your reply here..."
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TourInquiries;
