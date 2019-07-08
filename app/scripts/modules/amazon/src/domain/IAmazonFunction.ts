import { IFunction, IFunctionDeleteCommand, IFunctionUpsertCommand } from '@spinnaker/core';

export interface IAmazonFunction extends IFunction {
  credentials?: string;
  executionRole?: string;
}

export interface IAmazonFunctionUpsertCommand extends IFunctionUpsertCommand {
  runtime?: string;
  vpcId?: string;
}

export interface IAmazonFunctionDeleteCommand extends IFunctionDeleteCommand {
  runtime: string;
}
