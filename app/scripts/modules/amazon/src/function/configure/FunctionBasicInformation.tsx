import * as React from 'react';

import { FormikFormField, IWizardPageComponent, HelpField, TextInput, ReactSelectInput } from '@spinnaker/core';
import { FormikProps, Field } from 'formik';
import { IAmazonFunctionUpsertCommand } from 'amazon/index';
import { IAmazonFunction } from 'amazon/domain';

export interface IFunctionProps {
  formik: FormikProps<IAmazonFunctionUpsertCommand>;
  isNew?: boolean;
  functionDef: IAmazonFunction;
}

export interface IFunctionState {
  availableRuntimes: Array<{ label: string; value: string }>;
  defaultRuntime: string[];
}

export class FunctionBasicInformation extends React.Component<IFunctionProps, IFunctionState>
  implements IWizardPageComponent<IAmazonFunctionUpsertCommand> {
  public render() {
    const availableRuntimes = ['AAA', 'BBB'];
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
              name="Region"
              label="Region"
              help={<HelpField id="aws.function.region" />}
              input={props => (
                <TextInput {...props} type="text" className="form-control input-sm no-spel" name="name" />
              )}
            />
          </div>
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
              //onChange={this.accountChanged}
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
