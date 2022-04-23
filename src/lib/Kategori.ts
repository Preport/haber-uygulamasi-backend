import EKategori from './EKategoriler';
export default class Kategori {
    static parse(secimler: number) {
        const arr: number[] = [];
        for (let i = 0; i < Object.keys(EKategori).length; i++) {
            if ((secimler & (1 << i)) !== 0) {
                arr.push(i);
            }
        }
        return arr;
    }

    static convert(secimler: number[]) {
        let num = 0;
        for (const secim of secimler) {
            num += 1 << secim;
        }
        return num;
    }
}
