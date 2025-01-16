import { BaseProperty, BaseRecord, BaseResource, Filter, ParamsType, ActionContext } from 'adminjs';
import axios, { AxiosResponse } from 'axios';
import _ from 'lodash';

import { prisma } from '../prisma/client.js';

import {
  AllowedMetabaseResourcesType,
  FindApiResponses,
  MetabaseDatabaseListResponse,
  MetabaseTableListResponse,
  propertiesMap,
} from './metabase.types.js';
import { metabaseClient } from './metabase.api.js';

export class MetabaseResource extends BaseResource {
  resourceName: string;

  ownPropertiesArray: Array<BaseProperty>;

  ownPropertiesMap: Map<string, BaseProperty>;

  /**
   * Create a RESTful interface to a Metabase resource
   * @constructor
   * @param {string} resourceName - The resource path. Example `/api/database` becomes `database`.
   */
  constructor(resourceName: AllowedMetabaseResourcesType) {
    super(resourceName);

    this.resourceName = resourceName;

    if (!propertiesMap.has(this.resourceName)) {
      throw new Error(`${this.resourceName} does not exist in propertiesMap`);
    }

    this.ownPropertiesArray = propertiesMap.get(this.resourceName);
    this.ownPropertiesMap = new Map();
    this.ownPropertiesArray.forEach((property: BaseProperty) => this.ownPropertiesMap.set(property.path(), property));
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static isAdapterFor(rawResource): boolean {
    return true;
  }

  // eslint-disable-next-line class-methods-use-this
  databaseName(): string {
    return 'Metabase';
  }

  id(): string {
    return `${this.resourceName}`;
  }

  properties(): Array<BaseProperty> {
    return this.ownPropertiesArray;
  }

  property(path: string): BaseProperty | null {
    return this.ownPropertiesMap[path];
  }

  async getListResponseData() {
    const response: AxiosResponse<FindApiResponses> = await metabaseClient.get(`/api/${this.resourceName}`);
    if (this.resourceName === 'database') {
      return (response.data as MetabaseDatabaseListResponse).data;
    }
    return response.data as MetabaseTableListResponse;
  }

  static applyFilters(entry: BaseRecord, filter: Filter): boolean {
    const filters = filter?.filters || {};
    return Object.entries(filters).every(([key, filterObj]) => {
      const filterValue = filterObj?.value;
      const entryValue = entry.params?.[key];
      return filterValue === undefined || filterValue.toString() === entryValue?.toString();
    });
  }

  async find(filter: Filter, options, context?: ActionContext): Promise<Array<BaseRecord>> {
    const allowedDbIds = await MetabaseResource.getAllowedDbIds(context);
    const data = await this.getListResponseData();

    const records = data
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
  transformFindOne(original: Record<string, unknown>): Record<string, unknown> {
    return original;
  }

  async findOne(id: string, context?: ActionContext): Promise<BaseRecord | null> {
    const allowedDbIds = (context?.allowedDbIds as number[]) || (await MetabaseResource.getAllowedDbIds(context));

    try {
      const response = await metabaseClient.get(`/api/${this.resourceName}/${id}`);
      const postTransform = this.transformFindOne(response.data);
      const item = _.pick(postTransform, Array.from(this.ownPropertiesMap.keys()));

      if (await this.checkPermission(item, allowedDbIds, context)) {
        return new BaseRecord(item, this);
      }
      return null;
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        return new BaseRecord(
          {
            id,
            name: '[DELETED FROM METABASE]',
          },
          this
        );
      }

      throw err;
    }
  }

  async findMany(ids: Array<string | number>, context?: ActionContext): Promise<Array<BaseRecord>> {
    return Promise.all(ids.map((id) => this.findOne(id.toString(), context)));
  }

  // eslint-disable-next-line class-methods-use-this
  async count(): Promise<number> {
    return 1;
  }

  async update(id: string, params: Record<string, unknown>, context?: ActionContext): Promise<ParamsType> {
    const allowedDbIds = await MetabaseResource.getAllowedDbIds(context);

    const response = await metabaseClient.get(`/api/${this.resourceName}/${id}`);
    const postTransform = this.transformFindOne(response.data);
    const item = _.pick(postTransform, Array.from(this.ownPropertiesMap.keys()));

    if (!(await this.checkPermission(item, allowedDbIds, context))) {
      throw new Error(`You do not have permission to update this ${this.resourceName}.`);
    }

    await metabaseClient.put(`/api/${this.resourceName}/${id}`, params);
    const updatedResponse = await metabaseClient.get(`/api/${this.resourceName}/${id}`);
    return _.pick(updatedResponse.data, Array.from(this.ownPropertiesMap.keys()));
  }

  static async getAllowedDbIds(context: ActionContext): Promise<number[]> {
    return prisma.dataSourceOwnership
      .findMany({
        where: {
          organization: {
            organizationAdmins: {
              some: {
                userId: context.currentAdmin.id,
              },
            },
          },
        },
        select: {
          dataSourceId: true,
        },
      })
      .then((data) => data.map((d) => d.dataSourceId));
  }

  async checkPermission(item: ParamsType, allowedDbIds: number[], context?: ActionContext): Promise<boolean> {
    if (context.currentAdmin.isSuperuser === true) {
      return true;
    }

    if (this.resourceName === 'database') {
      return allowedDbIds.includes(item.id);
    }
    if (this.resourceName === 'table' || this.resourceName === 'field') {
      return allowedDbIds.includes(item.db_id);
    }
    throw new Error(`Filtering not configured for resource type: ${this.resourceName}`);
  }
}
