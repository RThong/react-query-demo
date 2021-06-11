import {
  addProduct,
  deleteProductById,
  getProduct,
  updateProductById,
} from '@/service/product';
import React, { useEffect, useRef, useState } from 'react';
import { Button, Input, Table, Form, Modal, InputNumber } from 'antd';
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
  useQueryClient,
} from 'react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      // cacheTime: 1000,
      cacheTime: 0,
      // staleTime: Infinity,
    },
  },
});

interface ProductItem {
  id: number | undefined;
  name: string;
  price: number;
}

const Com = ({ name }: { name: string }) => {
  const queryClient = useQueryClient();
  // useQuery('test', {
  //   cacheTime: 0,
  // });
  const { data, error, isLoading, isFetching, refetch, remove } = useQuery(
    'product',
    getProduct,
    // {
    //   cacheTime: 0,
    // },
  );

  useEffect(() => {
    if (data) {
      console.log('【name】', name);
      remove();
    }
  }, [data, name]);

  const [form] =
    Form.useForm<{
      name: string;
      price: number;
    }>();

  const [visible, setVisible] = useState(false);

  // useEffect(() => {
  //   setTimeout(() => {
  //     console.log('【------】', queryClient.getQueryCache());
  //   }, 2000);
  // }, [queryClient]);

  const deleteProductMutation = useMutation(deleteProductById, {
    onSuccess: () => {
      queryClient.invalidateQueries('product');
      // refetch();
    },
  });

  const addProductMutation = useMutation(addProduct, {
    onSuccess: () => {
      setVisible(false);
      refetch();
    },
  });

  const updateProductMutation = useMutation(updateProductById, {
    onSuccess: () => {
      setVisible(false);
      refetch();
    },
  });

  const columns = [
    {
      title: 'name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'price',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'action',
      dataIndex: 'action',
      key: 'action',
      render: (_, record) => {
        return (
          <div>
            <Button
              onClick={() => {
                setVisible(true);

                console.log(record);

                form.setFieldsValue(record);
              }}
            >
              改
            </Button>
            <Button
              onClick={() => {
                deleteProductMutation.mutate(record.id);
              }}
            >
              删
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div style={{ border: '1px dotted #ccc', width: 400, padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        这是table {name}
        <div>
          <Button
            onClick={() => {
              console.log('【getQueryCache】', queryClient.getQueryCache());
            }}
          >
            click
          </Button>
          <Button onClick={() => setVisible(true)}>增</Button>
        </div>
      </div>

      <Table
        loading={isFetching || deleteProductMutation.isLoading}
        columns={columns}
        dataSource={data}
        rowKey={(item) => item.id}
        pagination={false}
      />

      <Modal
        visible={visible}
        title={'表单' + name}
        onCancel={() => setVisible(false)}
        onOk={() => form.submit()}
        confirmLoading={addProductMutation.isLoading}
        destroyOnClose
      >
        <Form
          preserve={false}
          form={form}
          onFinish={(value) => {
            console.log(value);

            addProductMutation.mutate(value);
          }}
          labelCol={{ span: 3 }}
          labelAlign="right"
        >
          <Form.Item label="id" name="id" required hidden>
            <Input></Input>
          </Form.Item>
          <Form.Item label="name" name="name" required>
            <Input></Input>
          </Form.Item>
          <Form.Item label="price" name="price" required>
            <InputNumber />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

const Text = () => {
  useQuery('test', getProduct);
  return <div>123</div>;
};

const index = () => {
  const [visible, setVisible] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <Button onClick={() => setVisible((v) => !v)}>click</Button>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <Com name="A" />
        </div>

        <div>
          <Com name="B" />
        </div>

        {visible && <Text />}
      </div>
    </QueryClientProvider>
  );
};

export default index;
