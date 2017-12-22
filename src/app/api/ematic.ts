const enabled = typeof window !== 'undefined' && location.host === 'www.leflair.vn';
const queue: Array<Array<any>> = [];

const process = () => {
    while ((window as any).ematic && queue.length) {
        let data = queue.shift();

        (window as any).ematic(...data);
    }

    if (!(window as any).ematic && queue.length) {
        setTimeout(process, 1000);
    }
};

const em = (...args: Array<any>) => {
    if (!enabled) {
        return console.log('Ematic: ', ...args);
    }

    if (!(window as any).ematic) {
        queue.push(args);

        setTimeout(process);
        return;
    }

    (window as any).ematic(...args);
};

export const init = (email: string) => {
    const apiKey = '416050dba26511e796c00242ac110002-sg4';

    em('set', 'email', email);
};
