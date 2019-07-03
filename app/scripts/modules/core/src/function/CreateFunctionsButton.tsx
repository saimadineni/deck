import * as React from 'react';

import { Application } from 'core/application';
import { CloudProviderRegistry, ProviderSelectionService } from 'core/cloudProvider';
import { FunctionsChoiceModal } from './FunctionsChoiceModal';
import { ILoadBalancer } from 'core/domain';
import { ILoadBalancerUpsertCommand } from 'core/loadBalancer';
import { ModalInjector, ReactInjector } from 'core/reactShims';
import { IModalComponentProps, Tooltip } from 'core/presentation';

export interface ILoadBalancerModalProps extends IModalComponentProps {
  className?: string;
  dialogClassName?: string;
  app: Application;
  forPipelineConfig?: boolean;
  loadBalancer: ILoadBalancer;
  command?: ILoadBalancerUpsertCommand; // optional, when ejecting from a wizard
  closeModal?(loadBalancerCommand: ILoadBalancerUpsertCommand): void; // provided by ReactModal
  dismissModal?(rejectReason?: any): void; // provided by ReactModal
}

export interface ICreateLoadBalancerButtonProps {
  app: Application;
}

export class CreateFunctionsButton extends React.Component<ICreateLoadBalancerButtonProps> {
  constructor(props: ICreateLoadBalancerButtonProps) {
    super(props);
  }

  private createFunctions = (): void => {
    const { skinSelectionService } = ReactInjector;
    const { app } = this.props.app;

    FunctionsChoiceModal.show({
      app: app,
      application: app,
      forPipelineConfig: false,
      function: null,
      isNew: true,
    });

    // ProviderSelectionService.selectProvider(app, 'function').then(selectedProvider => {
    //   skinSelectionService.selectSkin(selectedProvider).then(selectedSkin => {
    //     const provider = CloudProviderRegistry.getValue(selectedProvider, 'function', selectedSkin);

    //     if (provider.CreateLambdaFunctionModal) {
    //       provider.CreateLambdaFunctionModal.show({
    //         app: app,
    //         application: app,
    //         forPipelineConfig: false,
    //         function: null,
    //         isNew: true,
    //       });
    //     } else {

    //     }
    //   });
    // }
    //);
  };

  public render() {
    return (
      <div>
        <button className="btn btn-sm btn-default" onClick={this.createFunctions}>
          <span className="glyphicon glyphicon-plus-sign visible-lg-inline" />
          <Tooltip value="Create Function">
            <span className="glyphicon glyphicon-plus-sign visible-md-inline visible-sm-inline" />
          </Tooltip>
          <span className="visible-lg-inline"> Create Function</span>
        </button>
      </div>
    );
  }
}
