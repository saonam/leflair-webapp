import * as md5 from 'md5';
import { UserProps } from '../api/account';
import { OrderProps, ProductProps as OrderProductProps } from '../api/orders';
import { ProductProps as SaleProductProps } from '../api/sales';
import { CartItemProps } from '../api/cart';

const dataLayer: any = typeof window !== 'undefined' && location.host === 'www.leflair.vn' ? (window as any)['dataLayer'] || {
  push: () => {}
} : {
  push: (...args: any[]) => console.log(args)
};

export const setUser = ({ email }: UserProps) => {
  if (email) {
    dataLayer.push({
      event: 'criteo',
      HashedEmail: md5(email.toLowerCase())
    });
  }
};

export const viewHomepage = () => {
  dataLayer.push({
    event: 'criteo',
    PageType: 'Homepage'
  });
};

export const viewContent = (id: string) => {
  dataLayer.push({
    event: 'criteo',
    PageType: 'Productpage',
    ProductID: id
  });
};

export const viewSale = (products: SaleProductProps[]) => {
  dataLayer.push({
    event: 'criteo',
    PageType: 'Listingpage',
    ProductIDList: products.slice(0, 3).map((p: SaleProductProps) => `${p.id}${p.color || p.size ? `_${p.color || p.size}` : ''}`)
  });
};

export const viewCart = (products: CartItemProps[]) => {
  dataLayer.push({
    event: 'criteo',
    PageType: 'Basketpage',
    ProductBasketProducts: products.map((p: CartItemProps) => ({
      id: `${p.productContentId}${p.color || p.size ? `_${p.color || p.size}` : ''}`,
      price: p.salePrice,
      quantity: p.quantity
    }))
  });
};

export const captureOrder = (order: OrderProps) => {
  dataLayer.push({
    event: 'criteo',
    PageType: 'Transactionpage',
    TransactionID: order.code,
    ProductTransactionProducts: order.products.map((p: OrderProductProps) => ({
      id: `${p.productId}${p.color || p.size ? `_${p.color || p.size}` : ''}`,
      price: p.salePrice,
      quantity: p.quantity
    }))
  });
};
