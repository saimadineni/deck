import * as React from 'react';
import { cloneDeep, get } from 'lodash';
import {
  IFunctionModalProps,
  FunctionWriter,
  ReactInjector,
  ReactModal,
  TaskMonitor,
  WizardModal,
  WizardPage,
  noop,
  MapEditor,
  HelpField,
} from '@spinnaker/core';

import { IAmazonFunction, IAmazonFunctionUpsertCommand } from 'amazon/domain';
import { FunctionBasicInformation } from './configure/FunctionBasicInformation';
import { ExecutionRole } from './configure/ExecutionRole';

import { FunctionEnvironmentVariables } from './configure/FunctionEnvironmentVariables';
import { Network } from './configure/Network';

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

  constructor(props: IAmazonCreateFunctionProps) {
    super(props);

    const funcCommand = props.command as IAmazonFunctionUpsertCommand;

    this.state = {
      isNew: !props.functionDef,
      functionCommand: funcCommand,
      taskMonitor: null,
    };
  }

  private _isUnmounted = false;
  private refreshUnsubscribe: () => void;

  public static show(props: IAmazonCreateFunctionProps): Promise<IAmazonFunctionUpsertCommand> {
    const modalProps = { dialogClassName: 'wizard-modal modal-lg' };
    return ReactModal.show(CreateLambdaFunction, props, modalProps);
  }

  public componentWillUnmount(): void {
    this._isUnmounted = true;
    if (this.refreshUnsubscribe) {
      this.refreshUnsubscribe();
    }
  }

  protected onApplicationRefresh(values: IAmazonFunctionUpsertCommand): void {
    if (this._isUnmounted) {
      return;
    }

    this.refreshUnsubscribe = undefined;
    this.props.dismissModal();
    this.setState({ taskMonitor: undefined });
    const newStateParams = {
      name: values.name,
      accountId: values.credentials,
      region: values.region,
      vpcId: values.vpcId,
      provider: 'aws',
    };

    if (!ReactInjector.$state.includes('**.functionDetails')) {
      ReactInjector.$state.go('.functionDetails', newStateParams);
    } else {
      ReactInjector.$state.go('^.functionDetails', newStateParams);
    }
  }

  private onTaskComplete(values: IAmazonFunctionUpsertCommand): void {
    this.props.app.functions.refresh();
    this.refreshUnsubscribe = this.props.app.functions.onNextRefresh(null, () => this.onApplicationRefresh(values));
  }

  private submit = (values: IAmazonFunctionUpsertCommand): void => {
    const { app, forPipelineConfig, closeModal } = this.props;
    const { isNew } = this.state;
    const functionCommandFormatted = cloneDeep(values);

    const descriptor = isNew ? 'Create' : 'Update';

    const taskMonitor = new TaskMonitor({
      application: app,
      title: `${isNew ? 'Creating' : 'Updating'} your load balancer`,
      modalInstance: TaskMonitor.modalInstanceEmulation(() => this.props.dismissModal()),
      onTaskComplete: () => this.onTaskComplete(functionCommandFormatted),
    });

    taskMonitor.submit(() => {
      return FunctionWriter.upsertFunction(functionCommandFormatted, app, descriptor);
    });

    this.setState({ taskMonitor });
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
                render={({ innerRef }) => (
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
                render={({ innerRef }) => {
                  return (
                    <ExecutionRole ref={innerRef} app={app} formik={formik} isNew={isNew} functionDef={functionDef} />
                  );
                }}
              />
              <WizardPage
                label="Environment variables"
                wizard={wizard}
                order={nextIdx()}
                render={({ innerRef }) => {
                  return (
                    <FunctionEnvironmentVariables
                      ref={innerRef}
                      app={app}
                      formik={formik}
                      isNew={isNew}
                      functionDef={functionDef}
                    />
                  );
                }}
              />
              <WizardPage
                label="Network"
                wizard={wizard}
                order={nextIdx()}
                render={innerRef => {
                  return <Network ref={innerRef} app={app} formik={formik} isNew={isNew} functionDef={functionDef} />;
                }}
              />
            </>
          );
        }}
      />
    );
  }
}
