import * as Payment from 'payment';

import { Transaction } from './transaction';
import { CreditCardProps } from '../payment-method';

// for paydollar
const dict: { [key: string]: string } = {
  mastercard: 'Master',
  dinersclub: 'Diners'
};
const mapType = (type: string) => dict[type] ? dict[type] : type.toUpperCase();

export class CardTransaction extends Transaction {
  requestData: any = {};

  addClientData(inputCreditCard: CreditCardProps): CardTransaction {
    let requestData: any = {};
    if (!!inputCreditCard.cardNumber) {
      requestData = {
        cardHolder: inputCreditCard.cardName,
        cardNo: inputCreditCard.cardNumber,
        pMethod: mapType(inputCreditCard.type),
        epMonth: inputCreditCard.expiry.month,
        epYear: inputCreditCard.expiry.year,
      }
    }
    requestData.securityCode = inputCreditCard.cvv;
    this.requestData = Object.assign(this.requestData, requestData);
    return this;
  }

  addServerData(data: any): CardTransaction {
    this.requestData = Object.assign(this.requestData, data);
    return this;
  }

  private addAdditionalUrl(data: any) {
    data.successUrl = this.getSuccessUrl();
    data.failUrl = this.getErrorUrl();
    data.errorUrl = this.getErrorUrl();
    return data;
  }

  processPayment() {
    let formElement = document.createElement('form');
    formElement.setAttribute('method', 'post');
    formElement.setAttribute('action', this.requestData.transactionUrl);

    let data = this.addAdditionalUrl(this.requestData);
    for (let key in data) {
      let hiddenField = document.createElement('input');
      hiddenField.setAttribute('type', 'hidden');
      hiddenField.setAttribute('name', key);
      hiddenField.setAttribute('value', data[key]);
      formElement.appendChild(hiddenField);
    }

    document.body.appendChild(formElement);
    formElement.submit();
    document.body.removeChild(formElement);

    return new Promise(() => {});
  }
};
