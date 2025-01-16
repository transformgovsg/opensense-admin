import { convertFilter, convertParam, Resource } from '@adminjs/prisma';
import { ActionContext, BaseRecord, Filter, ForbiddenError } from 'adminjs';
import { enhance } from '@zenstackhq/runtime';

import logger from '../../logger.js';

interface PrismaClientKnownRequestError extends Error {
  name: string;
  message: string;
}

const lowerCase = (name: string): string => name.substring(0, 1).toLowerCase() + name.substring(1);

export class ZenstackResource extends Resource {
  async getEnhancedPrisma(context: ActionContext) {
    const userId = context.currentAdmin?.id;

    if (!userId) {
      throw new Error('ZenstackResource being invoked without currentAdmin');
    }

    const user = await this.client.user.findFirstOrThrow({
      where: {
        id: userId,
      },
      include: {
        Superuser: true,
        admins: {
          include: {
            organization: {
              include: {
                DataSourceOwnership: true,
              },
            },
          },
        },
      },
    });

    return enhance(this.client, { user });
  }

  async getEnhancedManager(context: ActionContext) {
    const prismaClient = await this.getEnhancedPrisma(context);
    return prismaClient[lowerCase(this.model.name)];
  }

  // eslint-disable-next-line class-methods-use-this
  handlePrismaError<T>(promise: Promise<T>): Promise<T> {
    return promise.catch((error: unknown) => {
      if (
        typeof error === 'object' &&
        error !== null &&
        'name' in error &&
        'message' in error &&
        (error as PrismaClientKnownRequestError).name === 'PrismaClientKnownRequestError'
      ) {
        const prismaError = error as PrismaClientKnownRequestError;
        if (prismaError.message) {
          logger.error(prismaError);
          throw new ForbiddenError(prismaError.message);
        }
      }
      throw error;
    });
  }

  public async count(filter: Filter, context?: ActionContext): Promise<number> {
    return (await this.getEnhancedManager(context)).count({
      where: convertFilter(this.model.fields, filter),
    });
  }

  public async find(
    filter: Filter,
    params: {
      limit?: number;
      offset?: number;
      sort?: {
        sortBy?: string;
        direction?: 'asc' | 'desc';
      };
    } = {},
    context: ActionContext = undefined
  ): Promise<Array<BaseRecord>> {
    const { limit = 10, offset = 0, sort = {} } = params;

    const orderBy = this.buildSortBy(sort);
    const manager = await this.getEnhancedManager(context);
    return this.handlePrismaError(
      manager
        .findMany({
          where: convertFilter(this.model.fields, filter),
          skip: offset,
          take: limit,
          orderBy,
        })
        .then((results) => results.map((result) => new BaseRecord(this.prepareReturnValues(result), this)))
    );
  }

  async findOne(id: string | number, context?: ActionContext): Promise<BaseRecord | null> {
    const idProperty = this.properties().find((property) => property.isId());
    if (!idProperty) return null;

    return this.handlePrismaError(
      (await this.getEnhancedManager(context))
        .findUnique({
          where: {
            [idProperty.path()]: convertParam(idProperty, this.model.fields, id),
          },
        })
        .then((result) => (result ? new BaseRecord(this.prepareReturnValues(result), this) : null))
    );
  }

  public async findMany(ids: Array<string | number>, context?: ActionContext): Promise<Array<BaseRecord>> {
    const idProperty = this.properties().find((property) => property.isId());
    if (!idProperty) return [];

    return this.handlePrismaError(
      (await this.getEnhancedManager(context))
        .findMany({
          where: {
            [idProperty.path()]: {
              in: ids.map((id) => convertParam(idProperty, this.model.fields, id)),
            },
          },
        })
        .then((results) => results.map((result) => new BaseRecord(this.prepareReturnValues(result), this)))
    );
  }

  public async create(params: Record<string, any>, context?: ActionContext): Promise<Record<string, any>> {
    const preparedParams = this.prepareParams(params);

    return this.handlePrismaError(
      (await this.getEnhancedManager(context))
        .create({ data: preparedParams })
        .then((result) => this.prepareReturnValues(result))
    );
  }

  public async update(
    pk: string | number,
    params: Record<string, any> = {},
    context: ActionContext = undefined
  ): Promise<Record<string, any>> {
    const idProperty = this.properties().find((property) => property.isId());
    if (!idProperty) return {};

    const preparedParams = this.prepareParams(params);

    return this.handlePrismaError(
      (await this.getEnhancedManager(context))
        .update({
          where: {
            [idProperty.path()]: convertParam(idProperty, this.model.fields, pk),
          },
          data: preparedParams,
        })
        .then((result) => this.prepareReturnValues(result))
    );
  }

  public async delete(id: string | number, context?: ActionContext): Promise<void> {
    const idProperty = this.properties().find((property) => property.isId());
    if (!idProperty) return;

    await this.handlePrismaError(
      (await this.getEnhancedManager(context)).delete({
        where: {
          [idProperty.path()]: convertParam(idProperty, this.model.fields, id),
        },
      })
    );
  }
}
