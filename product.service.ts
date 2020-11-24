import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IResultWithPagination } from './result-with-pagination.interface';
import { SERVER_API_URL } from '../../../../app.constants';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IProduct } from './product.interface';
import { IResultProductGammes } from 'app/pmt/search-product/shared/result-product-gammes.interface';
import { IPlant } from 'app/shared/model/plant.model';
import { IPhase } from 'app/shared/model/phase.model';
import { IProductGammes } from 'app/pmt/search-product/shared';
import { ICostCenterCpByPlantPhase } from '../cost-center/cost-center-cp-by-plant-phase.interface';
import { IGammeGant } from 'app/pmt/search-product/shared/gamme-gant.interface';
import { IGammeInput } from 'app/pmt/search-product/shared/gamme-input.interface';
import { AllocationUnit } from 'app/pmt/search-product/shared/allocation-unit.interface';
import { IProductTreeGrid } from 'app/pmt/search-product/shared/nomenclature-tab/product-tree-grid.interface';
import { IProductGrid } from 'app/pmt/search-product/shared/nomenclature-tab';
import { IMissingAllocationProduct } from './missing-allocation-product.interface';

@Injectable()
export class ProductService {

    private readonly resource_url = SERVER_API_URL + '/api/palma/search-product';
    private readonly resource_url_without_allocations = SERVER_API_URL + '/api/palma/products-without-allocation-by-plant-and-phase';
    private readonly resource_url_search_gamme = SERVER_API_URL + '/api/palma/search-all-last-gammes';
    private readonly resource_url_create_gamme = SERVER_API_URL + '/api/palma/first';
    private readonly resource_url_search_all_gammes = SERVER_API_URL + '/api/palma/search-all-gammes';
    private readonly resource_url_search_nomenclature_tree_grid = SERVER_API_URL + '/api/palma/nomenclature';
    private readonly resource_url_search_nomenclature_grid = SERVER_API_URL + '/api/palma/nomenclature-grid';
    private readonly resource_url_create_allocation = SERVER_API_URL + '/api/palma/create';
    private readonly resource_url_edit_allocation = SERVER_API_URL + '/api/palma/edit';
    private readonly resource_url_delete_costcenter = SERVER_API_URL + '/api/palma/delete';
    private readonly resource_url_user_preferences = SERVER_API_URL + 'api/user-preferences';
    private readonly resource_url_user_update_preference = SERVER_API_URL + 'api/user-preferences/edit';
    private readonly resource_url_user_update_missing_allocation_product = SERVER_API_URL + 'api/edit-pmt-products';

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

    public queryWithoutAllocations(plant: IPlant,
        phase: IPhase,
        ): Observable<any> {
        const URL = `${this.resource_url_without_allocations}`;
        return this.http.get<IMissingAllocationProduct>(URL + `?plantId=${plant.id}&phaseId=${phase.id}`);
    }

    public querySearchGamme(plant: IPlant,
        phase: IPhase,
        product: IProduct): Observable<IResultProductGammes> {
        const URL = `${this.resource_url_search_gamme}`;
        return this.http.get<IResultProductGammes>(URL + `?plantId=${plant.id}&phaseId=${phase.id}&productId=${product.id}`);
    }

    public queryCreateGamme(gamme: IGammeInput): Observable<any> {
        const URL = `${this.resource_url_create_gamme}`;
        return this.http.post<IProductGammes>(URL, gamme);
    }

    public queryDeleteAllocations(plant: IPlant,
        phase: IPhase,
        product: IProduct,
        costCenter: ICostCenterCpByPlantPhase,
        nomenclature: string): Observable<IResultProductGammes> {
        const URL = `${this.resource_url_delete_costcenter}`;
        const gamme = {
            plantId: plant.id,
            phaseId: phase.id,
            productId: product.id,
            costcenterId: costCenter.id,
            nomenclature
        } as IGammeInput;
        return this.http.post<IResultProductGammes>(URL, gamme);
    }

    public querySearchAllGammes(plant: IPlant,
        phase: IPhase,
        product: IProduct,
        costCenter: ICostCenterCpByPlantPhase,
        allocationIndicator: string,
        nomenclature: string): Observable<IGammeGant[]> {
        const URL = `${this.resource_url_search_all_gammes}`;
        const params = new HttpParams()
            .set('plantId', plant.id.toString())
            .set('phaseId', phase.id.toString())
            .set('productId', product.id.toString())
            .set('costcenterId', costCenter.id.toString())
            .set('allocationIndicator', allocationIndicator)
            .set('nomenclature', nomenclature);

        return this.http.get<IGammeGant[]>(URL, { params });
    }

    public queryNomenclatureTreeGrid(plant: IPlant,
        product: IProduct,
        date: string,
        depth: number): Observable<IProductTreeGrid[]> {
        const URL = `${this.resource_url_search_nomenclature_tree_grid}`;
        const params = `?plantId=${plant.plantId}&parentProductId=${product.productId}&date=${date}&depth=${depth}`;
        return this.http.get<IProductTreeGrid[]>(URL + params);
    }

    public queryNomenclatureGrid(plant: IPlant,
        product: IProduct,
        date: string,
        depth: number): Observable<IProductGrid[]> {
        const URL = `${this.resource_url_search_nomenclature_grid}`;
        const params = `?plantId=${plant.plantId}&parentProductId=${product.productId}&date=${date}&depth=${depth}`;
        return this.http.get<IProductGrid[]>(URL + params);
    }

    public queryCreateAllocation(gamme: IGammeGant): Observable<IGammeGant> {
        const URL = `${this.resource_url_create_allocation}`;
        return this.http.post<IGammeGant>(URL, gamme);
    }

    public queryEditAllocation(gamme: IGammeInput): Observable<IGammeInput> {
        const URL = `${this.resource_url_edit_allocation}`;
        return this.http.post<IGammeInput>(URL, gamme);
    }

    public queryGetUserPreferences() {
        const URL = `${this.resource_url_user_preferences}`;
        return this.http.get(URL);
    }

    public queryUpdateUserPreference(preferences: any): Observable<AllocationUnit> {
        const URL = `${this.resource_url_user_update_preference}`;
        return this.http.post<AllocationUnit>(URL, preferences);
    }

    public queryUpdateMissingAllocationProduct(products: any): Observable<IProduct> {
        const URL = `${this.resource_url_user_update_missing_allocation_product}`;
        return this.http.post<IProduct>(URL, products);
    }

}
