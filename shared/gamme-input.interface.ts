import * as moment from 'moment';

export interface IGammeInput {
    gammeId?: number;
    plantId?: number;
    phaseId?: number;
    productId?: number;
    costcenterId?: number;
    value?: number;
    nomenclature?: string;
    comment?: string;
    allocationIndicator?: string;
    validityStart?: Date | moment.Moment;
}
