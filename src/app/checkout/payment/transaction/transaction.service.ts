import { ATMTransaction } from './atm-transaction';
import { CardTransaction } from './card-transaction';

export const getTransaction = (paymentMethod: string = 'CC') => {
  switch(paymentMethod) {
    case 'ATM':
      return new ATMTransaction();
    default:
      return new CardTransaction();
  }
}
