import localFont from 'next/font/local';

export const lineSeedSans = localFont({
    src: [
        {
            path: './LINESeedSansTH_W_Bd.woff2',
            weight: '700',
            style: 'bold',
        },
        {
            path: './LINESeedSansTH_W_Rg.woff2',
            weight: '400',
            style: 'regular',
        },
        {
            path: './LINESeedSansTH_W_Th.woff2',
            weight: '100',
            style: 'thin',
        },
        {
            path: './LINESeedSansTH_W_XBd.woff2',
            weight: '800',
            style: 'extrabold',
        },
        {
            path: './LINESeedSansTH_W_He.woff2',
            weight: '900',
            style: 'black',
        },
    ],
})