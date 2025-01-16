import { BaseRecord, Filter, ActionContext } from 'adminjs';
import _ from 'lodash';
import { AxiosResponse } from 'axios';

import { MetabaseResource } from './metabase.resource.js';
import { MetabaseFieldFindOneResponse, MetabaseMetadataResponse } from './metabase.types.js';
import { metabaseClient } from './metabase.api.js';

export class MetabaseFieldResource extends MetabaseResource {
  async find(filter: Filter, options, context?: ActionContext): Promise<Array<BaseRecord>> {
    const tableId = filter.filters?.table_id?.value;

    if (!tableId) {
      return [];
    }

    const allowedDbIds = await MetabaseResource.getAllowedDbIds(context);

    const response: AxiosResponse<MetabaseMetadataResponse> = await metabaseClient.get(
      `/api/table/${tableId}/query_metadata`,
      {
        params: {
          include_sensitive_fields: 'true',
        },
      }
    );

    const records = response.data.fields
      .map((entry) => ({ ...entry, db_id: response.data.db_id }))
      .map((entry) => _.pick(entry, Array.from(this.ownPropertiesMap.keys())))
      .map((entry) => new BaseRecord(entry, this));

    const filteredRecords = await Promise.all(
      records.map(async (entry) => {
        const isAllowed = await this.checkPermission(entry.params, allowedDbIds, context);
        return isAllowed ? entry : null;
      })
    );

    return filteredRecords
      .filter((entry): entry is BaseRecord => entry !== null)
      .filter((entry) => MetabaseResource.applyFilters(entry, filter));
  }

  // eslint-disable-next-line class-methods-use-this
  transformFindOne(original: MetabaseFieldFindOneResponse): Record<string, unknown> {
    return {
      ...original,
      db_id: original?.table?.db_id,
    };
  }
}
