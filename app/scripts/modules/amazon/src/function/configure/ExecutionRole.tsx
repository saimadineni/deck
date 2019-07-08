import * as React from 'react';

import { FormikFormField, IWizardPageComponent, HelpField, TextInput, ReactSelectInput } from '@spinnaker/core';
import { FormikProps, Field } from 'formik';
import { IAmazonFunctionUpsertCommand } from 'amazon/index';
import { IAmazonFunction } from 'amazon/domain';

export interface IExecutionRoleProps {
  formik: FormikProps<IAmazonFunctionUpsertCommand>;
  isNew?: boolean;
  roleName: string;
}

export interface IExecutionRoleState {
  availableRoles: Array<{ label: string; value: string }>;
}

export class ExecutionRole extends React.Component<IExecutionRoleProps, IExecutionRoleState>
  implements IWizardPageComponent<IAmazonFunctionUpsertCommand> {
  public render() {
    const availableRoles = ['Create New', 'Role1', 'Role2'];
    return (
      <div className="form-group">
        <div className="col-md-11">
          <div className="sp-margin-m-bottom">
            <FormikFormField
              name="Execution role"
              label="Execution role"
              help={<HelpField id="aws.function.execution.role" />}
              fastField={false}
              input={props => (
                <ReactSelectInput
                  inputClassName="cloudfoundry-react-select"
                  {...props}
                  value={availableRoles[0]}
                  stringOptions={availableRoles}
                  clearable={false}
                />
              )}
              //onChange={this.accountChanged}
              required={false}
            />
          </div>
        </div>
      </div>
    );
  }
}
