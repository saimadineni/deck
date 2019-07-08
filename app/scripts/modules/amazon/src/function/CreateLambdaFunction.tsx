import * as React from 'react';

import {
  IFunctionModalProps,
  FunctionWriter,
  ReactInjector,
  ReactModal,
  TaskMonitor,
  WizardModal,
  WizardPage,
  noop,
} from '@spinnaker/core';

import { IAmazonFunction, IAmazonFunctionUpsertCommand } from 'amazon/domain';
import { FunctionBasicInformation } from './configure/FunctionBasicInformation';
import { ExecutionRole } from './configure/ExecutionRole';

export interface IAmazonCreateFunctionProps extends IFunctionModalProps {
  functionDef: IAmazonFunction;
}
export interface IAmazonCreateFunctionState {
  isNew: boolean;
  functionCommand: IAmazonFunctionUpsertCommand;
  taskMonitor: TaskMonitor;
}

export class CreateLambdaFunction extends React.Component<IAmazonCreateFunctionProps, IAmazonCreateFunctionState> {
  public static defaultProps: Partial<IAmazonCreateFunctionProps> = {
    closeModal: noop,
    dismissModal: noop,
  };

  public static show(props: IAmazonCreateFunctionProps): Promise<IAmazonFunctionUpsertCommand> {
    const modalProps = { dialogClassName: 'wizard-modal modal-lg' };
    return ReactModal.show(CreateLambdaFunction, props, modalProps);
  }

  constructor(props: IAmazonCreateFunctionProps) {
    super(props);

    const funcCommand = props.command;

    this.state = {
      isNew: !props.functionDef,
      functionCommand: funcCommand,
      taskMonitor: null,
    };
  }

  private submit = (): void => {
    console.log('IN CALL TO SUBMIT');
  };

  public render() {
    const { app, dismissModal, forPipelineConfig, functionDef } = this.props;
    const { isNew, functionCommand, taskMonitor } = this.state;

    let heading = forPipelineConfig ? 'Configure Existing Function' : 'Create New Function';
    if (!isNew) {
      heading = `Edit ${functionCommand.name}: ${functionCommand.region}: ${functionCommand.credentials}`;
    }

    return (
      <WizardModal<IAmazonFunctionUpsertCommand>
        heading={heading}
        initialValues={functionCommand}
        taskMonitor={taskMonitor}
        dismissModal={dismissModal}
        closeModal={this.submit}
        submitButtonLabel={forPipelineConfig ? (isNew ? 'Add' : 'Done') : isNew ? 'Create' : 'Update'}
        render={({ formik, nextIdx, wizard }) => {
          return (
            <>
              <WizardPage
                label="Basic information"
                wizard={wizard}
                order={nextIdx()}
                render={innerRef => (
                  <FunctionBasicInformation
                    ref={innerRef}
                    app={app}
                    formik={formik}
                    isNew={isNew}
                    functionDef={functionDef}
                  />
                )}
              />
              <WizardPage
                label="Permissions"
                wizard={wizard}
                order={nextIdx()}
                render={innerRef => {
                  return (
                    <ExecutionRole ref={innerRef} app={app} formik={formik} isNew={isNew} functionDef={functionDef} />
                  );
                }}
              />
            </>
          );
        }}
      />
    );
  }
}
