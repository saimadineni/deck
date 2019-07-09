import { IFunction, IFunctionDeleteCommand, IFunctionUpsertCommand } from '@spinnaker/core';
import { string } from 'prop-types';

export interface IAmazonFunction extends IFunction {
  credentials?: string;
  executionRole?: string;
}

export interface IAmazonFunctionUpsertCommand extends IFunctionUpsertCommand {
  runtime?: string;
  vpcId?: string;
  account?: string;
}

export interface IAmazonFunctionDeleteCommand extends IFunctionDeleteCommand {
  runtime: string;
}
