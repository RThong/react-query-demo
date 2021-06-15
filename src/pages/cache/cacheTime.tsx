import { getProduct } from '@/service/product';
import { useState } from 'react';
import { Button } from 'antd';
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  useQueryClient,
} from 'react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      cacheTime: 0,
      // cacheTime: Infinity,
      // cacheTime: 10000,
    },
  },
});

const Test = () => {
  const { data } = useQuery('test', getProduct);

  console.log('【test】', data);

  return <div>query key是test的useQuery实例</div>;
};

const CacheCom = () => {
  const queryClient = useQueryClient();

  return (
    <div>
      <Button
        onClick={() => {
          const queryCache = queryClient.getQueryCache();
          console.log('【当前缓存】', queryCache);
        }}
      >
        获取缓存
      </Button>
    </div>
  );
};

const Index = () => {
  const [visible, setVisible] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <div>
        cacheTime: 当同一个query
        key的所以useQuery实例卸载后，在cacheTime时间后就会清除对应缓存
      </div>
      <div>
        <Button onClick={() => setVisible((v) => !v)}>控制Test显隐</Button>
        <CacheCom />
        {visible && <Test />}
      </div>
    </QueryClientProvider>
  );
};

export default Index;
