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
              ???
            </Button>
            <Button
              onClick={() => {
                deleteProductMutation.mutate(record.id);
              }}
            >
              ???
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div style={{ border: '1px dotted #ccc', width: 400, padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        ??????table {name}
        <div>
          <Button onClick={() => setVisible(true)}>???</Button>
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
        title={'??????' + name}
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

  console.log('???test???', data);

  return <div>query key???test???useQuery??????</div>;
};

const Index = () => {
  const [visible, setVisible] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <div>
        ??????????????????query
        key???useQuery?????????????????????????????????????????????????????????????????????;
        <br />
        ?????????????????????query
        key?????????????????????????????????????????????????????????????????????useQuery???????????????????????????????????????????????????????????????
        <br />
        ??????????????????????????????????????????????????????????????????
        <br />
        ?????????????????????????????????query key???useQuery???????????????isFetching?????????true
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
          ??????????????????query key???product???useQuery??????
        </Button>
        {visible && <Test />}
      </div>
    </QueryClientProvider>
  );
};

export default Index;
