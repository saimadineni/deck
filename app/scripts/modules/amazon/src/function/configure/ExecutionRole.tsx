import * as React from 'react';
import { Option } from 'react-select';

import { FormikFormField, IWizardPageComponent, HelpField, TextInput, ReactSelectInput } from '@spinnaker/core';
import { FormikProps, Field, FormikErrors } from 'formik';
import { IAmazonFunctionUpsertCommand } from 'amazon/index';
import { IAmazonFunction } from 'amazon/domain';

export interface IExecutionRoleProps {
  formik: FormikProps<IAmazonFunctionUpsertCommand>;
  isNew?: boolean;
  functionDef: IAmazonFunction;
}

export interface IExecutionRoleState {
  //availableRoles: Array<{ label: string; value: string }>;
  some: '';
}

export class ExecutionRole extends React.Component<IExecutionRoleProps, IExecutionRoleState>
  implements IWizardPageComponent<IAmazonFunctionUpsertCommand> {
  constructor(props: IExecutionRoleProps) {
    super(props);
    this.state = {
      some: '',
    };
  }

  public validate(): FormikErrors<IAmazonFunctionUpsertCommand> {
    return {};
  }

  public componentDidMount() {
    // this.setState({ createNewRole: true });
  }

  public componentWillReceiveProps(nextProps: IExecutionRoleProps): void {
    //this.setState(this.getState(nextProps));
  }

  // private getState(props: IExecutionRoleProps): IExecutionRoleState {
  //     const roleExists = props.isNew ? false : true;
  //     return {
  //       //availableRoles: AuthenticationService.getAuthenticatedUser().roles
  //     };
  //   }

  public render() {
    const { errors, values } = this.props.formik;

    return (
      <div className="form-group">
        <div className="col-md-11">
          <div className="sp-margin-m-bottom">
            <FormikFormField
              name="role"
              label="Role ARN"
              fastField={false}
              input={props => (
                <TextInput
                  {...props}
                  type="text"
                  placeholder="Enter role ARN"
                  className="form-control input-sm no-spel"
                  name="roleARN"
                  value={values.role}
                />
              )}
              required={true}
            />
          </div>
        </div>
      </div>
    );
  }
}
