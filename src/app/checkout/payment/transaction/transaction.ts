interface ITransaction {
    addCode(code: string): ITransaction;
    getSuccessUrl(): string;
    getErrorUrl(): string;
    addClientData(inputCreditCard: any, cardService: string): ITransaction;
    addServerData(data: any): ITransaction;
    processPayment(): Promise<any>;
}

export class Transaction implements ITransaction {
    code: string;

    constructor() {}

    addCode(code: string): Transaction {
        this.code = code;
        return this;
    }

    getSuccessUrl(): string {
        return `${location.protocol}//${location.host}/cart/checkout/thank-you/${this.code}`;
    }

    getErrorUrl(): string {
        return `${location.protocol}//${location.host}/cart/checkout`;
    }

    addClientData(inputCreditCard: any): Transaction {
        return this;
    }
    
    addServerData(data: any): Transaction {
        return this;
    }

    processPayment(): Promise<any> {
        return new Promise((resolve) => resolve());
    }
}
