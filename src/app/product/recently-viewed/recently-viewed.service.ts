class RecentlyViewedProductsService {
  private products: any[] = [];

  constructor() {
    try {
      let products: string = localStorage.getItem('recentlyViewedProducts');
      if (products) {
        this.products = JSON.parse(products);
      }
    } catch (e) {
      // User has localStorage disabled
      // We should not report this issue
      this.products = [];
    }
  }

  getProducts({ ignore }: { ignore: any }): any[] {
    return ignore ? this.products.filter((p: any) => {
      const startTime = (new Date(p.startTime)).getTime();
      const endTime = (new Date(p.endTime)).getTime();
      const now = (new Date()).getTime();
      return (p.id !== ignore.id || p.queryParams !== ignore.queryParams) && now > startTime && now < endTime; // If startTime and endTime not available, `getTime()` returns value NaN which make all comparisons false anyway
    }) : this.products;
  }

  /*
   * first param: product content
   * second param: selected product
   */ 
  addProduct({ id, title, brand, images, sale }: any, { imageKey, retailPrice, salePrice, color, size }: any): any {
    const product = {
      id,
      title,
      brand,
      image: images[imageKey][0],
      image2: images[imageKey][images[imageKey].length - 1],
      retailPrice,
      salePrice,
      queryParams: color || size ? `?${color ? 'color' : 'size'}=${color || size}` : undefined,
      slug: `${title}-${id}`,
      startTime: sale.startTime,
      endTime: sale.endTime
    };

    const index = this.products.findIndex((p: any) => p.id === product.id && p.queryParams === product.queryParams);

    if (index === -1) {
      // prepend product to the list
      this.products.splice(0, 0, product);
    } else {
      // move it to the front
      this.products.splice(0, 0, this.products.splice(index, 1)[0]);
    }

    // trim to 10 items
    if (this.products.length > 10) {
      this.products.length = 10;
    }

    try {
      // update localStorage
      localStorage.setItem('recentlyViewedProducts', JSON.stringify(this.products));
    } catch (e) {
      // User has localStorage disabled, or it is full
      // We should not report this issue
    }

    return {
      ...this.products[0]
    };
  }
}

export default RecentlyViewedProductsService;
