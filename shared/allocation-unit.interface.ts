import * as moment from 'moment';

export interface AllocationUnit {
    id?: number;
    userName?: string;
    lastChoiceDisplayGamme?: string;
    dateUpdate?: moment.Moment;
}
