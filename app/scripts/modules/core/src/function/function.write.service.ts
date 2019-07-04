import { IPromise } from 'angular';

import { Application } from 'core/application/application.model';
import { ITask } from 'core/domain';
import { IJob, TaskExecutor } from 'core/task/taskExecutor';
import { IMoniker } from 'core/naming/IMoniker';

export interface IFunctionUpsertCommand extends IJob {
  name: string;
  cloudProvider: string;
  credentials: string;
  detail?: string;
  moniker?: IMoniker;
  region: string;
  stack?: string;
}

export interface IFunctionDeleteCommand extends IJob {
  cloudProvider: string;
  functionName: string;
  credentials: string;
  regions?: string[];
  vpcId?: string;
}

export class FunctionWriter {
  public static deleteFunction(command: IFunctionDeleteCommand, application: Application): ng.IPromise<ITask> {
    command.type = 'deleteFunction';

    return TaskExecutor.executeTask({
      job: [command],
      application,
      description: `Delete load balancer: ${command.functionName}`,
    });
  }

  public static upsertFunction(
    command: IFunctionUpsertCommand,
    application: Application,
    descriptor: string,
    params: any = {},
  ): IPromise<ITask> {
    Object.assign(command, params);
    command.type = 'upsertFunction';

    return TaskExecutor.executeTask({
      job: [command],
      application,
      description: `${descriptor} Load Balancer: ${command['name']}`,
    });
  }
}
