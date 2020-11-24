import { IGamme } from './gamme.interface';
import { ICostCenterCpByPlantPhase } from 'app/pmt/shared/entity/cost-center/cost-center-cp-by-plant-phase.interface';

export interface IProductGammes {
    nomenclature?: string;
    costcenter?: ICostCenterCpByPlantPhase;
    gm?: string;
    typeUOs?: string[];
    indicators?: string[];
    gammes?: IGamme[];
}
