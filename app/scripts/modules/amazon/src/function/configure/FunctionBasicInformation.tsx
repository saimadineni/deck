import * as React from 'react';
import { Observable, Subject } from 'rxjs';
import { FormikFormField, AccountService, IAccount, IWizardPageComponent, HelpField, TextInput, ReactSelectInput } from '@spinnaker/core';
import { FormikProps, Field } from 'formik';
import { IAmazonFunctionUpsertCommand } from 'amazon/index';
import { IAmazonFunction } from 'amazon/domain';
import { IAmazonCreateFunctionProps } from '../CreateLambdaFunction';

const availableRuntimes = [
  'nodejs',
  'nodejs4.3',
  'nodejs6.10',
  'nodejs8.10',
  'nodejs10.x',
  'java8',
  'python2.7',
  'python3.6',
  'python3.7',
  'dotnetcore1.0',
  'dotnetcore2.0',
  'dotnetcore2.1',
  'nodejs4.3-edge',
  'go1.x',
  'ruby2.5',
  'provided',
];

export interface IFunctionProps {
  formik: FormikProps<IAmazonFunctionUpsertCommand>;
  isNew?: boolean;
  functionDef: IAmazonFunction;
}

export interface IFunctionState {
  availableRuntimes: Array<{ label: string; value: string }>;
  accounts: IAccount[]
  defaultRuntime: string[];
}

export class FunctionBasicInformation extends React.Component<IFunctionProps, IFunctionState>
  implements IWizardPageComponent<IAmazonFunctionUpsertCommand> {
    constructor(props: IFunctionProps) {
      super(props);
      AccountService.listAccounts('aws').then((acc: IAccount) => {
        this.state.accounts = acc
      })
    }
    public state: IFunctionState = {
      accounts: [],
      availableRuntimes: null,
      defaultRuntime: []
    };

    public render() {
      const { accounts } = this.state
    return (
      <div className="form-group">
        <div className="col-md-11">
          <div className="sp-margin-m-bottom">
            <FormikFormField
              name="Function name"
              label="Function name"
              help={<HelpField id="aws.function.name" />}
              input={props => (
                <TextInput {...props} type="text" className="form-control input-sm no-spel" name="name" />
              )}
            />
          </div>
          <div className="sp-margin-m-bottom">
            <FormikFormField
              name="account"
              label="Account"
              help={<HelpField id="aws.function.name" />}
              input={props => (
                <ReactSelectInput
                inputClassName="cloudfoundry-react-select"
                {...props}
                stringOptions={accounts.map((acc: IAccount) => acc.name)}
                clearable={true}
              />
            )}
            // onChange={this.accountChanged}
            required={true}
          />
          </div>
          {accounts && <div className="sp-margin-m-bottom">
            <FormikFormField
              name="Region"
              label="Region"
              help={<HelpField id="aws.function.region" />}
              input={props => (
                <TextInput {...props} type="text" className="form-control input-sm no-spel" name="name" />
              )}
            />
          </div>}
          <div className="sp-margin-m-bottom">
            <FormikFormField
              name="Runtime"
              label="Runtime"
              help={<HelpField id="aws.function.runtime" />}
              fastField={false}
              input={props => (
                <ReactSelectInput
                  inputClassName="cloudfoundry-react-select"
                  {...props}
                  stringOptions={availableRuntimes}
                  clearable={false}
                />
              )}
              // onChange={this.accountChanged}
              required={true}
            />
          </div>
          <div className="sp-margin-m-bottom">
            <FormikFormField
              name="S3 Bucket"
              label="S3 Bucket"
              help={<HelpField id="aws.function.s3bucket" />}
              input={props => (
                <TextInput {...props} type="text" className="form-control input-sm no-spel" name="name" />
              )}
            />
          </div>
        </div>
      </div>
    );
  }
}
