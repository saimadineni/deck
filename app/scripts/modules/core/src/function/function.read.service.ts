import { IPromise, module } from 'angular';

import { API } from 'core/api/ApiService';
import { IComponentName, NameUtils } from 'core/naming';
import { IFunctions, IFunctionsSourceData } from 'core/domain';

export interface IFunctionsByAccount {
  name: string;
  accounts: Array<{
    name: string;
    regions: Array<{
      name: string;
      functionss: IFunctionsSourceData[];
    }>;
  }>;
}

export class FunctionsReader {
  // public static $inject = ['$q', 'functionsTransformer'];
  // public constructor(private $q: IQService, private functionsTransformer: any) {}

  public loadFunctions(applicationName: string): IPromise<IFunctionsSourceData[]> {
    console.log('Function Reader in the read service: ' + applicationName);

    return API.one('applications', applicationName)
      .all('functions')
      .getList()
      .then((functionsReturned: any) => {
        console.log('DONE HERE ??');
        return functionsReturned;
      });
  }

  public getFunctionsDetails(
    cloudProvider: string,
    account: string,
    region: string,
    name: string,
  ): IPromise<IFunctionsSourceData[]> {
    return API.all('functionss')
      .all(account)
      .all(region)
      .all(name)
      .withParams({ provider: cloudProvider })
      .get();
  }

  public listFunctionss(cloudProvider: string): IPromise<IFunctionsByAccount[]> {
    console.log('List Functions with: ' + cloudProvider);

    return API.all('functionss')
      .withParams({ provider: cloudProvider })
      .getList();
  }

  private normalizeFunctions(functions: IFunctionsSourceData): IPromise<IFunctions> {
    return this.functionsTransformer.normalizeFunctions(functions).then((lb: IFunctions) => {
      const nameParts: IComponentName = NameUtils.parseLoadBalancerName(lb.name);
      lb.stack = nameParts.stack;
      lb.detail = nameParts.freeFormDetails;
      lb.cloudProvider = lb.cloudProvider || lb.type || lb.provider;
      return lb;
    });
  }
}

export const FUNCTIONS_READ_SERVICE = 'spinnaker.core.functions.read.service';
// tslint:disable-next-line: no-console
console.log('Read Service module.ts loaded');
module(FUNCTIONS_READ_SERVICE, []).service('functionsReader', FunctionsReader);
