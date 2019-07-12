import * as React from 'react';
import { Option } from 'react-select';

import { FormikFormField, IWizardPageComponent, HelpField, MapEditor } from '@spinnaker/core';
import { FormikProps, Field, FormikErrors } from 'formik';
import { IAmazonFunctionUpsertCommand } from 'amazon/index';
import { IAmazonFunction } from 'amazon/domain';

export interface IFunctionTagsProps {
  formik: FormikProps<IAmazonFunctionUpsertCommand>;
  isNew?: boolean;
  functionDef: IAmazonFunction;
}

export interface IFunctionTagsState {
  some: string;
}

export class FunctionTags extends React.Component<IFunctionTagsProps, IFunctionTagsState>
  implements IWizardPageComponent<IAmazonFunctionUpsertCommand> {
  private duplicateKeys = false;

  public validate = () => {
    const errors = {} as any;

    if (this.duplicateKeys) {
      errors.vars = 'Tags have duplicate keys.';
    }

    return errors;
  };

  public componentDidMount() {
    this.setState({ some: '' });
  }

  private varsChanged = (tag: [{ [key: string]: string }], duplicateKeys: boolean) => {
    this.duplicateKeys = duplicateKeys;
    this.props.formik.setFieldValue('tags', Array(tag));
    console.log(tag);
  };

  public render() {
    return (
      <div className="form-group">
        <div className="col-md-11">
          <div className="sp-margin-m-bottom">
            <b>Tags (optional)</b>
            <HelpField id="aws.function.tags" />
          </div>
          <MapEditor model={{} as any} allowEmpty={true} onChange={this.varsChanged} />
        </div>
      </div>
    );
  }
}
