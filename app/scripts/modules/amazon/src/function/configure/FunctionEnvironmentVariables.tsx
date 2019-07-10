import * as React from 'react';
import { Option } from 'react-select';

import { FormikFormField, IWizardPageComponent, HelpField, MapEditor } from '@spinnaker/core';
import { FormikProps, Field, FormikErrors } from 'formik';
import { IAmazonFunctionUpsertCommand } from 'amazon/index';
import { IAmazonFunction } from 'amazon/domain';

export interface IFunctionEnvironmentVariablesProps {
  formik: FormikProps<IAmazonFunctionUpsertCommand>;
  isNew?: boolean;
  functionDef: IAmazonFunction;
}

export interface IFunctionEnvironmentVariablesState {
  some: string;
}

export class FunctionEnvironmentVariables
  extends React.Component<IFunctionEnvironmentVariablesProps, IFunctionEnvironmentVariablesState>
  implements IWizardPageComponent<IAmazonFunctionUpsertCommand> {
  private duplicateKeys = false;

  public validate = () => {
    const errors = {} as any;

    if (this.duplicateKeys) {
      errors.vars = 'Variables have duplicate keys.';
    }

    return errors;
  };

  public componentDidMount() {
    this.setState({ some: '' });
  }

  private varsChanged = (envVar: { [key: string]: string }, duplicateKeys: boolean) => {
    this.duplicateKeys = duplicateKeys;
    this.props.formik.setFieldValue('environmentVars', envVar);
  };

  public render() {
    return (
      <div className="form-group">
        <div className="col-md-11">
          <div className="sp-margin-m-bottom">
            <b>Environment Variables (optional)</b>
            <HelpField id="aws.function.env.vars" />
          </div>
          <MapEditor model={{} as any} allowEmpty={true} onChange={this.varsChanged} />
        </div>
      </div>
    );
  }
}
