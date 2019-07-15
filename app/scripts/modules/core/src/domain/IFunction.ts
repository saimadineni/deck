import { ITaggedEntity } from './ITaggedEntity';
import { IMoniker } from 'core/naming/IMoniker';

export interface IFunctionSourceData {
  cloudProvider?: string;
  name?: string;
  provider?: string;
  type?: string;
}

export interface IFunction extends ITaggedEntity {
  account?: string;
  cloudProvider?: string;
  detail?: string;
  functionType?: string;
  name?: string;
  moniker?: IMoniker;
  provider?: string;
  region?: string;
  searchField?: string;
  type?: string;
  vpcId?: string;
  vpcName?: string;
}
