import { IPlant } from 'app/shared/model/plant.model';
import { IPhase } from 'app/shared/model/phase.model';
import { IProduct } from 'app/pmt/shared/entity/search-product';
import { ICostCenterCpByPlantPhase } from 'app/pmt/shared/entity/cost-center/cost-center-cp-by-plant-phase.interface';
import * as moment from 'moment';

export interface IGammeGant {
    id?: number;
    plant?: IPlant;
    phase?: IPhase;
    product?: IProduct;
    costcenter?: ICostCenterCpByPlantPhase;
    costcenterName?: string;
    validityStart?: Date | moment.Moment;
    validityEnd?: Date | moment.Moment;
    dateUpdate?: Date | moment.Moment;
    formatedValue?: number;
    formatedDelta?: number;
    value?: number;
    previousValue?: number;
    delta?: number;
    nomemclature?: string;
    allocationIndicator?: string;
    comment?: string;
    userName?: string;
    measureUnitDescription?: string;
}
