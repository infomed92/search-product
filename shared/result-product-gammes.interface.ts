import { IProduct } from 'app/pmt/shared/entity/search-product';
import { IProductGammes } from './product-gammes.interface';

export interface IResultProductGammes {
    product?: IProduct;
    n2Gammes?: IProductGammes[];
    n1Gammes?: IProductGammes[];
}
