import { ActionContext, BaseRecord, Filter, ParamsType } from 'adminjs';

import { MetabaseResource } from './metabase.resource.js';

export class MetabaseTableResource extends MetabaseResource {
  /**
   * Transform Metabase Native Values to User-Friendly values shown on AdminJS
   * The visibility_type in the API can either be 'hidden' or null. These are
   * confusing for users.
   *
   * Thus, this adapter translates,
   * null   <=> normal
   * hidden <=> sensitive
   *
   * Also creates congruence with the terminology used for Fields.
   */

  async update(id: string, params: Record<string, unknown>, context?: ActionContext): Promise<ParamsType> {
    const updateParams = params;

    if (Object.keys(params).includes('visibility_type')) {
      updateParams.visibility_type = MetabaseTableResource.transformToRepresentation(params);
    }
    return super.update(id, updateParams, context);
  }

  async find(filter: Filter, options, context?: ActionContext): Promise<Array<BaseRecord>> {
    const records = await super.find(filter, options, context);
    records.forEach((entry) => MetabaseTableResource.transformToNative(entry));
    return records;
  }

  async findOne(id: string, context?: ActionContext): Promise<BaseRecord | null> {
    const record = await super.findOne(id, context);

    if (!record) {
      return null;
    }

    return MetabaseTableResource.transformToNative(record);
  }

  async findMany(ids: Array<string | number>, context?: ActionContext): Promise<Array<BaseRecord>> {
    const records = await super.findMany(ids, context);
    records.forEach((entry) => MetabaseTableResource.transformToNative(entry));
    return records;
  }

  static transformToRepresentation(params: Record<string, unknown>) {
    return params.visibility_type === 'sensitive' ? 'hidden' : null;
  }

  static transformToNative(record: BaseRecord) {
    if (record.get('visibility_type') === null) {
      record.set('visibility_type', 'normal');
    } else {
      record.set('visibility_type', 'sensitive');
    }
    return record;
  }
}
