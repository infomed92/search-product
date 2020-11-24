export interface IAllocation {
    costCenterLabel?: string;
    n1tajUoe1?: number;
    n1tajUoe2?: number;
    n2tajUoe1?: number;
    n2tajUoe2?: number;
    n1tsoUoe1?: number;
    n1tsoUoe2?: number;
    n2tsoUoe1?: number;
    n2tsoUoe2?: number;
}

export interface IProductTreeGrid {
    productId?: string;
    label?: string;
    typeFabrique?: string;
    coef?: number;
    percentFictive?: number;
    allocations?: IAllocation;
    children?: IProductTreeGrid[];
}
