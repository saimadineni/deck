import { IPromise, module } from 'angular';

import { API } from 'core/api/ApiService';
// import { IComponentName, NameUtils } from 'core/naming';
import { IFunctionsSourceData } from 'core/domain';

export interface IFunctionsByAccount {
  name: string;
  accounts: Array<{
    name: string;
    regions: Array<{
      name: string;
      functions: IFunctionsSourceData[];
    }>;
  }>;
}

export class FunctionsReader {
  // public static $inject = ['$q', 'functionsTransformer'];
  // public constructor(private $q: IQService, private functionsTransformer: any) {}

  public loadFunction(applicationName: string): IPromise<IFunctionsSourceData[]> {
    console.log('Function Reader in the read service: ' + applicationName);

    return (
      API.one('applications', applicationName)
        // TODO: replace with functions endpoint.
        .all('loadBalancers')
        .getList()
        .then((functionsReturned: any) => {
          console.log('Temporary Fix, until /functions endpoint is created in gate');
          return functionsReturned;
        })
    );
  }

  public getFunctionsDetails(
    cloudProvider: string,
    account: string,
    region: string,
    name: string,
  ): IPromise<IFunctionsSourceData[]> {
    return API.all('functions')
      .all(account)
      .all(region)
      .all(name)
      .withParams({ provider: cloudProvider })
      .get();
  }

  public listFunctionss(cloudProvider: string): IPromise<IFunctionsByAccount[]> {
    console.log('List Functions with: ' + cloudProvider);

    return API.all('functions')
      .withParams({ provider: cloudProvider })
      .getList();
  }
}

export const FUNCTIONS_READ_SERVICE = 'spinnaker.core.functions.read.service';

console.log('Read Service module.ts loaded');
module(FUNCTIONS_READ_SERVICE, []).service('functionsReader', FunctionsReader);
