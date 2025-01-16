import { BaseProperty, PropertyType } from 'adminjs';

export const AllowedMetabaseResources = ['database', 'table', 'field'] as const;
export type AllowedMetabaseResourcesType = (typeof AllowedMetabaseResources)[number];

export enum MetabaseVisibility {
  normal = 'normal',
  sensitive = 'sensitive',
}

class EnumProperty extends BaseProperty {
  protected values: string[];

  constructor({ path, values }: { path: string; values: string[] }) {
    super({ path });
    this.values = values;
  }

  // eslint-disable-next-line class-methods-use-this
  type() {
    return 'string' as PropertyType;
  }

  availableValues(): Array<string> | null {
    return this.values;
  }
}

const DatabaseProperties: Array<BaseProperty> = [
  new BaseProperty({
    path: 'id',
    isId: true,
  }),
  new BaseProperty({ path: 'name' }),
];

const TableProperties: Array<BaseProperty> = [
  new BaseProperty({
    path: 'id',
    isId: true,
  }),
  new BaseProperty({ path: 'name' }),
  new BaseProperty({ path: 'display_name' }),
  new BaseProperty({ path: 'description' }),
  new BaseProperty({ path: 'db_id' }),
  new EnumProperty({
    path: 'visibility_type',
    values: [MetabaseVisibility.normal, MetabaseVisibility.sensitive],
  }),
];

const FieldProperties: Array<BaseProperty> = [
  new BaseProperty({
    path: 'id',
    isId: true,
  }),
  new BaseProperty({ path: 'name' }),
  new BaseProperty({ path: 'display_name' }),
  new BaseProperty({ path: 'description' }),
  new BaseProperty({ path: 'table_id' }),
  new BaseProperty({ path: 'db_id' }),
  new EnumProperty({
    path: 'visibility_type',
    values: [MetabaseVisibility.normal, MetabaseVisibility.sensitive],
  }),
];

export type MetabaseDatabaseListResponse = {
  data: {
    id: number;
    name: string;
  }[];
};

export type MetabaseTableListResponse = {
  id: number;
  name: string;
  display_name: string;
  db_id: number;
  visibility_type: null | 'hidden'; // null is visible
}[];

export type MetabaseMetadataResponse = {
  fields: {
    id: number;
    table_id: number;
    name: string;
    display_name: string;
    description: string;
    visibility_type: MetabaseVisibility;
  }[];
  db_id: number;
};

export type MetabaseFieldFindOneResponse = {
  id: number;
  table_id: number;
  name: string;
  display_name: string;
  description: string;
  table: {
    db_id: number;
  };
};

export type FindApiResponses = MetabaseTableListResponse | MetabaseDatabaseListResponse;

export const propertiesMap: Map<string, Array<BaseProperty>> = new Map([
  ['database', DatabaseProperties],
  ['table', TableProperties],
  ['field', FieldProperties],
]);
