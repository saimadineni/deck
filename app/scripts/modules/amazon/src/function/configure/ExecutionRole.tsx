import * as React from 'react';
import { Option } from 'react-select';

import { FormikFormField, IWizardPageComponent, HelpField, TextInput, ReactSelectInput } from '@spinnaker/core';
import { FormikProps, Field, FormikErrors } from 'formik';
import { IAmazonFunctionUpsertCommand } from 'amazon/index';
import { IAmazonFunction } from 'amazon/domain';

const roleOptions = ['Create a new role with basic Lambda permissions', 'Use an existing role'];

export interface IExecutionRoleProps {
  formik: FormikProps<IAmazonFunctionUpsertCommand>;
  isNew?: boolean;
  functionDef: IAmazonFunction;
}

export interface IExecutionRoleState {
  //availableRoles: Array<{ label: string; value: string }>;
  createNewRole: boolean;
}

export class ExecutionRole extends React.Component<IExecutionRoleProps, IExecutionRoleState>
  implements IWizardPageComponent<IAmazonFunctionUpsertCommand> {
  constructor(props: IExecutionRoleProps) {
    super(props);
    this.handleRoleOption = this.handleRoleOption.bind(this);
    this.roleSelect = this.roleSelect.bind(this);
    //this.state = this.getState(props);
    this.state = { createNewRole: true };
  }

  public validate(): FormikErrors<IAmazonFunctionUpsertCommand> {
    return {};
  }

  public componentDidMount() {
    this.setState({ createNewRole: true });
  }
  // public componentWillReceiveProps(nextProps: IExecutionRoleProps): void {
  //     this.setState(this.getState(nextProps));
  //   }

  // private getState(props: IExecutionRoleProps): IExecutionRoleState {

  //     return {
  //       availableRoles: AuthenticationService.getAuthenticatedUser().roles
  //     };
  //   }

  private handleRoleOption = (option: Option<string>) => {
    const opt = option.target.value;
    if (opt.includes('new')) {
      this.setState({ createNewRole: true });
    } else {
      this.setState({ createNewRole: false });
    }
  };

  private roleSelect = (option: Option<string>) => {
    const role = option.target.value;
    this.props.formik.setFieldValue('executionRole', role);
    console.log(role);
  };

  public render() {
    const { errors, values } = this.props.formik;
    const newRole = this.state.createNewRole;
    return (
      <div className="form-group">
        <div className="col-md-11">
          <div className="sp-margin-m-bottom">
            <FormikFormField
              name="excutionRole"
              label="Execution role"
              help={<HelpField id="aws.function.execution.role" />}
              fastField={false}
              input={props => (
                <ReactSelectInput
                  inputClassName="cloudfoundry-react-select"
                  {...props}
                  value={this.state.createNewRole ? roleOptions[0] : roleOptions[1]}
                  stringOptions={roleOptions}
                  clearable={false}
                  onChange={this.handleRoleOption}
                />
              )}
              required={false}
            />
          </div>
          {!newRole && (
            <div className="sp-margin-m-bottom">
              <FormikFormField
                name="Existing role"
                label="Existing role"
                fastField={false}
                input={props => (
                  // <ReactSelectInput
                  // inputClassName="cloudfoundry-react-select"
                  // {...props}
                  // value={this.state.availableRoles[0]}
                  // stringOptions={this.state.availableRoles}
                  // clearable={false}
                  // />
                  <TextInput
                    {...props}
                    type="text"
                    placeholder="Enter role ARN"
                    className="form-control input-sm no-spel"
                    name="roleARN"
                    onChange={this.roleSelect}
                    value={values.executionRole}
                  />
                )}
                //onChange={this.roleSelect}
                required={false}
              />
            </div>
          )}
        </div>
      </div>
    );
  }
}
