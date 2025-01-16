import { BaseDatabase, BaseResource } from 'adminjs';

export class MetabaseDatabase extends BaseDatabase {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static isAdapterFor(database: never): boolean {
    return false;
  }

  // eslint-disable-next-line class-methods-use-this
  resources(): Array<BaseResource> {
    return [];
  }
}
