import { PlusOutlined } from "@ant-design/icons";
import { Button, Modal, Input, message } from "antd";
import React, { useEffect, useState } from "react";
import { ColorManagementApi } from "../../../api/admin/colorManagemnet/ColorManagementApi";

const ModalColor = ({
  setListColorSelected,
  isModalOpen,
  handleCancel,
}) => {
  const [listColor, setListColor] = useState([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newColorName, setNewColorName] = useState("");

  const getColor = () => {
    ColorManagementApi.getColor().then((res) => {
      res.data.forEach((element) => {
        element.active = false;
      });
      setListColor(res.data);
    });
  };

  useEffect(() => {
    if (isModalOpen) {
      getColor();
    }
  }, [isModalOpen]);

  const addColorSelected = (item) => {
    setListColorSelected((prevList) => {
      const exists = prevList.find((sel) => sel.id === item.id);

      if (exists) {
        item.active = false;
        return prevList.filter((sel) => sel.id !== item.id);
      } else {
        item.active = true;
        return [...prevList, item];
      }
    });
  };

  const handleCreateColor = async () => {
    if (!newColorName?.trim()) {
      message.warning("Vui lòng nhập tên màu");
      return;
    }
    try {
      await ColorManagementApi.create({ name: newColorName.trim() });
      message.success("Tạo màu thành công");
      setNewColorName("");
      setIsCreateOpen(false);
      getColor();
    } catch (e) {
      message.error("Tạo màu thất bại");
    }
  };

  return (
    <Modal
      title="Chọn màu:"
      open={isModalOpen}
      onOk={handleCancel}
      onCancel={handleCancel}
    >
      {listColor &&
        listColor.map((color) => {
          return (
            <Button
              onClick={() => {
                addColorSelected(color);
              }}
              style={{
                marginRight: 5,
                backgroundColor: color.active ? "blue" : "",
                color: color.active ? "white" : "black",
              }}
              key={color.id}
            >
              {color.name}
            </Button>
          );
        })}

      <Button
        icon={<PlusOutlined />}
        style={{
          backgroundColor: "orange",
          borderColor: "orange",
          margin: "5px",
        }}
        type="primary"
        onClick={() => setIsCreateOpen(true)}
      />
      <Modal
        title="Tạo màu mới"
        open={isCreateOpen}
        onOk={handleCreateColor}
        onCancel={() => setIsCreateOpen(false)}
        okText="Tạo"
        cancelText="Hủy"
      >
        <Input
          placeholder="Nhập tên màu"
          value={newColorName}
          onChange={(e) => setNewColorName(e.target.value)}
        />
      </Modal>
    </Modal>
  );
};

export default ModalColor;
