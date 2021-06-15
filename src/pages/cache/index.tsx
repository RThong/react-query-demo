import {
  addProduct,
  deleteProductById,
  getProduct,
  ProductItem,
  updateProductById,
} from '@/service/product';
import { useState } from 'react';
import { Button, Input, Table, Form, Modal, InputNumber } from 'antd';
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
  useQueryClient,
} from 'react-query';
import { ColumnsType } from 'antd/lib/table';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      // cacheTime: 0,
      cacheTime: Infinity,
      // cacheTime: 10000,
    },
  },
});

const Com = ({ name }: { name: string }) => {
  const queryClient = useQueryClient();

  const { data, error, isLoading, isFetching, refetch, remove } = useQuery(
    'product',
    getProduct,
    // {
    //   cacheTime: 0,
    // },
  );

  const [form] =
    Form.useForm<{
      id: number | undefined;
      name: string;
      price: number;
    }>();

  const [visible, setVisible] = useState(false);

  const deleteProductMutation = useMutation(deleteProductById, {
    onSuccess: () => {
      queryClient.invalidateQueries('product');
    },
  });

  const addProductMutation = useMutation(addProduct, {
    onSuccess: () => {
      setVisible(false);
      queryClient.invalidateQueries('product');
    },
  });

  const updateProductMutation = useMutation(updateProductById, {
    onSuccess: () => {
      setVisible(false);
      queryClient.invalidateQueries('product');
    },
  });

  const columns: ColumnsType<ProductItem> = [
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
          <Button onClick={() => setVisible(true)}>增</Button>
        </div>
      </div>

      <Table<ProductItem>
        loading={isFetching || deleteProductMutation.isLoading}
        columns={columns}
        dataSource={data || []}
        rowKey={(item) => item.id}
        pagination={false}
      />

      <Modal
        visible={visible}
        title={'表单' + name}
        onCancel={() => setVisible(false)}
        onOk={() => form.submit()}
        confirmLoading={
          addProductMutation.isLoading || updateProductMutation.isLoading
        }
        destroyOnClose
      >
        <Form
          preserve={false}
          form={form}
          onFinish={(value) => {
            console.log(value);
            if (value.id === undefined) {
              addProductMutation.mutate(value);
              return;
            }

            updateProductMutation.mutate(
              value as {
                id: number;
                name: string;
                price: number;
              },
            );
          }}
          labelCol={{ span: 3 }}
          labelAlign="right"
        >
          <Form.Item label="id" name="id" hidden>
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

const Test = () => {
  const { data } = useQuery('product', getProduct);

  console.log('【test】', data);

  return <div>query key是test的useQuery实例</div>;
};

const Index = () => {
  const [visible, setVisible] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <div>
        缓存：同一个query
        key的useQuery先查看是否有缓存，有的话直接先返回结果再去请求;
        <br />
        并且，当同一个query
        key的实例在请求过程中还未获得数据，这时创建其他的useQuery实例并不会发送重复请求，而是只有一个请求。
        <br />
        当获取到数据后，后续创建的实例才会发送请求。
        <br />
        当有请求发生时，同一个query key的useQuery实例返回的isFetching都会为true
      </div>

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <Com name="A" />
          </div>

          <div>
            <Com name="B" />
          </div>
        </div>
        <Button onClick={() => setVisible((v) => !v)}>
          创建一个新的query key是product的useQuery实例
        </Button>
        {visible && <Test />}
      </div>
    </QueryClientProvider>
  );
};

export default Index;
