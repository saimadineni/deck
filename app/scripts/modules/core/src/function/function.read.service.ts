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
      .all('functionss')
      .getList()
      .then(() => {
        console.log('DONE HERE ??');
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
}

export const FUNCTIONS_READ_SERVICE = 'spinnaker.core.functions.read.service';
// tslint:disable-next-line: no-console
console.log('Read Service module.ts loaded');
module(FUNCTIONS_READ_SERVICE, []).service('functionsReader', FunctionsReader);
