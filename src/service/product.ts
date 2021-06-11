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

const getAsync = (fn, timeout = 1000) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      fn(resolve);
    }, timeout);
  });
};

export const getProduct = () => {
  console.log('【getProduct】', productList);

  return getAsync((resolve) => resolve(productList));
};

export const getProductById = (id) =>
  getAsync((resolve) => resolve(productList.find((_) => _.id === id)));

export const deleteProductById = (id) => {
  console.log('【deleteProductById】', id);

  return getAsync((resolve) => {
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
  return getAsync((resolve) => {
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

export const updateProductById = (item: {
  id: number;
  name: string;
  price: number;
}) => {
  console.log('【updateProductById】');

  return getAsync((resolve) => {
    const index = productList.findIndex((_) => _.id === item.id);

    productList[index] = item;

    productList = [...productList];

    resolve(productList);
  });
};
