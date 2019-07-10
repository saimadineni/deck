import { IFunction, IFunctionDeleteCommand, IFunctionUpsertCommand } from '@spinnaker/core';

export interface IAmazonFunction extends IFunction {
  credentials?: string;
  executionRole?: string;
  runtime: string;
  s3bucket: string;
  s3key: string;
  handler: string;
  functionName: string;
  tags: [{ key: string; value: string }];
  description: string;
}

export interface IAmazonFunctionUpsertCommand extends IFunctionUpsertCommand {
  executionRole?: string;
  runtime: string;
  s3bucket: string;
  s3key: string;
  handler: string;
  functionName: string;
  tags: [{ key: string; value: string }];
  description: string;
}

export interface IAmazonFunctionDeleteCommand extends IFunctionDeleteCommand {
  runtime: string;
}
