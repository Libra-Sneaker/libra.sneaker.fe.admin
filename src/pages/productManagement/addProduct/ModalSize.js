import { PlusOutlined } from "@ant-design/icons";
import { Button, Modal } from "antd";
import React, { useEffect, useState } from "react";
import { SizeManagementApi } from "../../../api/admin/sizeManagement/SizeManagementApi";

const ModalSize = ({ isModalOpen, handleCancel, setListSizeSelected }) => {
  const [listSize, setListSize] = useState([]);

  const getSize = () => {
    SizeManagementApi.getSize().then((res) => {
      // Sort the data by name in ascending order
      const sortedData = res.data
        .map((element) => ({ ...element, active: false })) // Add active property
        .sort((a, b) => a.name.localeCompare(b.name)); // Sort by name
  
      console.log(sortedData);
  
      setListSize(sortedData); // Save sorted data in listSize
    });
  };
  

  useEffect(() => {
    if (isModalOpen) {
      getSize();
    }
  }, [isModalOpen]);

  const addSizeSelected = (item) => {
    setListSizeSelected((prevList) => {
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

  return (
    <div>
      <Modal
        title="Chọn size:"
        open={isModalOpen}
        onOk={handleCancel} // Đóng modal khi nhấn OK
        onCancel={handleCancel} // Đóng modal khi nhấn Cancel
      >
        {listSize &&
          listSize.map((size) => {
            return (
              <Button
                onClick={() => {
                  addSizeSelected(size);
                }}
                style={{
                  marginRight: 5,
                  backgroundColor: size.active ? "blue" : "",
                  color: size.active ? "white" : "black",
                }}
                key={size.id}
              >
                {size.name}
              </Button>
            );
          })}

        <Button
          icon={<PlusOutlined />}
          style={{
            backgroundColor: "orange",
            borderColor: "orange",
            margin: "10px",
          }}
          type="primary"
        />
      </Modal>
    </div>
  );
};

export default ModalSize;
