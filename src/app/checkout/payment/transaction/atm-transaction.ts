import { Transaction } from './transaction';

export class ATMTransaction extends Transaction {
  requestData: any = {};

  addServerData(data: any): ATMTransaction {
    if (data && typeof data === 'object') {
      this.requestData = {
        ...this.requestData,
        ...data
      };
    }

    return this;
  }

  processPayment() {
    const { vpc_URL, ...rest } = this.requestData;

    // init form elem
    const form = document.createElement('form');
    form.setAttribute('method', 'post');
    form.setAttribute('action', vpc_URL);
    form.setAttribute('accept-charset', 'UTF-8"');

    // add fields to form
    for (const key in rest) {
      const field = document.createElement('input');
      field.setAttribute('type', 'hidden');
      field.setAttribute('name', key);
      field.setAttribute('value', rest[key]);
      form.appendChild(field);
    }

    // submit form
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
    
    return new Promise(() => {});
  }
};
