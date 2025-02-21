import { IAllocationService, DefaultAllocationService } from './allocation-service';

export class AllocationServiceFactory {
  private static _service: IAllocationService;

  public static create(): IAllocationService {
    const service = this._service ?? new DefaultAllocationService();
    return service;
  }

  // Only available for testing
  public static setService(service: IAllocationService): void {
    if (process.env.NODE_ENV === 'test') {
      this._service = service;
    }
  }
}
