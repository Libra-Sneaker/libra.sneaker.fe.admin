import React from "react";
import styles from "./AddProductManagement.module.css";
import { Button, Card, Form, Input, Space, Typography } from "antd";
import { CloseOutlined } from '@ant-design/icons';

const AddProductManagement = () => {
  const [form] = Form.useForm();
  return (
    <div className={styles.addProductContainer}>
      <h2>Product &gt; Add Product</h2>

      <div className={styles.formProductContainer}>
      <Form
      form={form}
      name="product_form"
      style={{ maxWidth: 600 }}
      autoComplete="off"
      initialValues={{
        details: [{}],
      }}
    >
      <Form.Item label="Name" name="name">
        <Input />
      </Form.Item>

      <Form.Item label="Description" name="description">
        <Input.TextArea />
      </Form.Item>

      <Form.Item label="Status" name="status">
        <Input />
      </Form.Item>

      <Form.Item label="Brand ID" name="brandId">
        <Input />
      </Form.Item>

      <Form.Item label="Material ID" name="materialId">
        <Input />
      </Form.Item>

      <Form.Item label="Type ID" name="typeId">
        <Input />
      </Form.Item>

      <Form.List name="details">
        {(fields, { add, remove }) => (
          <div style={{ display: 'flex', flexDirection: 'column', rowGap: 16 }}>
            {fields.map((field) => (
              <Card
                size="small"
                title={`Detail ${field.name + 1}`}
                key={field.key}
                extra={
                  <CloseOutlined
                    onClick={() => remove(field.name)}
                  />
                }
              >
                <Form.Item label="Description" name={[field.name, 'description']}>
                  <Input />
                </Form.Item>
                
                <Form.Item label="Size ID" name={[field.name, 'sizeId']}>
                  <Input />
                </Form.Item>

                <Form.Item label="Color ID" name={[field.name, 'colorId']}>
                  <Input />
                </Form.Item>

                <Form.Item label="Product Code" name={[field.name, 'productCode']}>
                  <Input />
                </Form.Item>

                <Form.Item label="Price" name={[field.name, 'price']}>
                  <Input type="number" />
                </Form.Item>

                <Form.Item label="Quantity" name={[field.name, 'quantity']}>
                  <Input type="number" />
                </Form.Item>

                <Form.Item label="Status" name={[field.name, 'status']}>
                  <Input />
                </Form.Item>
              </Card>
            ))}
            <Button type="dashed" onClick={() => add()} block>
              + Add Detail
            </Button>
          </div>
        )}
      </Form.List>

      <Form.Item>
        <Button type="primary" htmlType="submit" style={{ marginTop: 16 }}>
          Submit
        </Button>
      </Form.Item>

      <Form.Item noStyle shouldUpdate>
        {() => (
          <Typography>
            <pre>{JSON.stringify(form.getFieldsValue(), null, 2)}</pre>
          </Typography>
        )}
      </Form.Item>
    </Form>

      </div>
    </div>
  );
};

export default AddProductManagement;
