import useSWR from 'swr';
import { BINANCE_API, SYMBOLS } from '../constants/config';

const fetcher = async () => {
    const promises = SYMBOLS.map(symbol =>
        fetch(`${BINANCE_API}?symbol=${symbol}&interval=1m&limit=200`)
            .then(res => {
                if (!res.ok) throw new Error('Network response was not ok');
                return res.json();
            })
            .then(data => data.map(d => ({
                time: d[0] / 1000,
                open: parseFloat(d[1]),
                high: parseFloat(d[2]),
                low: parseFloat(d[3]),
                close: parseFloat(d[4]),
            })))
    );

    const [btc, eth, sol] = await Promise.all(promises);
    return { btc, eth, sol };
};

export const useCryptoData = () => {
    return useSWR('crypto-data', fetcher, {
        refreshInterval: 3000,
        dedupingInterval: 2000,
        revalidateOnFocus: false,
        fallbackData: null
    });
};
