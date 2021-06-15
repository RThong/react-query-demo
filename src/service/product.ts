let productList = [
  {
    name: 'hong',
    price: 20,
    id: 1,
  },
  {
    name: 'wang',
    price: 18,
    id: 2,
  },
  {
    name: 'dong',
    price: 21,
    id: 3,
  },
  {
    name: 'ali',
    price: 22,
    id: 4,
  },
  {
    name: 'zhang',
    price: 24,
    id: 5,
  },
];

export interface ProductItem {
  id: number;
  name: string;
  price: number;
}

const getAsync = <T>(
  fn: (resolve: (value: T | PromiseLike<T>) => void) => void,
  timeout = 1000,
) => {
  return new Promise<T>((resolve, reject) => {
    setTimeout(() => {
      console.log('【获取数据成功】');

      fn(resolve);
    }, timeout);
  });
};

export const getProduct = () => {
  console.log('【getProduct】', productList);

  return getAsync<ProductItem[]>((resolve) => resolve(productList));
};

export const getProductById = (id: number) =>
  getAsync<ProductItem | undefined>((resolve) =>
    resolve(productList.find((_) => _.id === id)),
  );

export const deleteProductById = (id: number) => {
  console.log('【deleteProductById】', id);

  return getAsync<ProductItem[]>((resolve) => {
    productList = productList.filter((item) => item.id !== id);

    resolve(productList);
  });
};

export const addProduct = ({
  name,
  price,
}: {
  name: string;
  price: number;
}) => {
  console.log('【addProduct】');
  return getAsync<ProductItem[]>((resolve) => {
    const maxId = Math.max(...productList.map((_) => _.id));
    productList = [
      ...productList,
      {
        id: maxId + 1,
        name,
        price,
      },
    ];
    resolve(productList);
  });
};

export const updateProductById = (item: ProductItem) => {
  console.log('【updateProductById】');

  return getAsync<ProductItem[]>((resolve) => {
    const index = productList.findIndex((_) => _.id === item.id);

    productList[index] = item;

    productList = [...productList];

    resolve(productList);
  });
};
