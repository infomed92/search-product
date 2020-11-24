import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IResultWithPagination } from './result-with-pagination.interface';
import { SERVER_API_URL } from '../../../../app.constants';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IProduct } from './product.interface';
import { IPlant } from 'app/shared/model/plant.model';
import { IPhase } from 'app/shared/model/phase.model';

@Injectable()
export class ProductService {

    private readonly resource_url = SERVER_API_URL + '/api/palma/search-product';

    constructor(
        private readonly http: HttpClient
    ) { }

    public query(plant: IPlant,
        phase: IPhase,
        q: string,
        page: number,
        results: number): Observable<IResultWithPagination<IProduct>> {
        const URL = `${this.resource_url}`;
        return this.http.get<IResultWithPagination<IProduct>>(URL + `?plantId=${plant.id}&phaseId=${phase.id}&q=${q}&page=${page}&results=${results}`);
    }

}
