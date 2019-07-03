import * as React from 'react';

import { WizardModal, WizardPage, ReactModal } from '@spinnaker/core';

import { IAmazonClassicLoadBalancer, IAmazonClassicLoadBalancerUpsertCommand } from 'amazon/domain';

export interface IAmazonCreateLambdaModal {
  region: string;
  name: string;
}

export class CreateLambdaFunction extends React.Component<IAmazonCreateLambdaModal> {
  constructor(props: IAmazonCreateLambdaModal) {
    super(props);
    this.state = {
      region: [props.region],
      name: props.name,
    };
  }
  public static show(props: IAmazonCreateLambdaModal): Promise<IAmazonClassicLoadBalancerUpsertCommand> {
    console.log('Inside the CreateLambdaFunction Location');

    const modalProps = { dialogClassName: 'wizard-modal modal-lg' };
    return ReactModal.show(CreateLambdaFunction, props, modalProps);
  }

  public render(): React.ReactElement<CreateLambdaFunction> {
    return (
      <div>
        {' '}
        Tesing from the AWS Lambda.
        <WizardModal<IAmazonClassicLoadBalancerUpsertCommand>></WizardModal>
      </div>
    );
  }
}
