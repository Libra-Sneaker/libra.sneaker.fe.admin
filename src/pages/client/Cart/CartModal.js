import { Modal, List, Button, InputNumber, Typography, Empty } from "antd";
import React from "react";

const { Text } = Typography;

const productNameFromId = (id) => `Sản phẩm #${id}`; // placeholder

const CartModal = ({ visible, onClose, items, onChangeQty, onRemove, onCheckout }) => {
  const total = items.reduce((sum, it) => sum + (it.price || 0) * (it.qty || 1), 0);

  return (
    <Modal
      title="Giỏ hàng"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>Đóng</Button>,
        <Button key="checkout" type="primary" onClick={onCheckout} disabled={!items.length}>
          Thanh toán ({total.toLocaleString()} đ)
        </Button>,
      ]}
    >
      {items.length === 0 ? (
        <Empty description="Giỏ hàng trống" />
      ) : (
        <List
          itemLayout="horizontal"
          dataSource={items}
          renderItem={(item) => (
            <List.Item
              actions={[
                <InputNumber
                  key="qty"
                  min={1}
                  value={item.qty || 1}
                  onChange={(v) => onChangeQty(item.id, v || 1)}
                  size="small"
                />,
                <Button key="rm" danger type="text" onClick={() => onRemove(item.id)}>Xóa</Button>,
              ]}
            >
              <List.Item.Meta
                title={<Text>{item.name || productNameFromId(item.id)}</Text>}
                description={<Text strong>{(item.price || 0).toLocaleString()} đ</Text>}
                avatar={
                  item.image ? (
                    <img src={item.image} alt={item.name} style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 6 }} />
                  ) : null
                }
              />
            </List.Item>
          )}
        />
      )}
    </Modal>
  );
};

export default CartModal;


