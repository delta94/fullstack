import { FastifyRequest } from 'fastify';
import { classToClass } from 'class-transformer';
import { REQUEST } from '@nestjs/core';
import { Inject, PipeTransform, ArgumentMetadata } from '@nestjs/common';
import { permissonsMap } from './permission-config';

/**
 *  Using @Group or @Expose with @Transform in DTO return `unedfined` property,
 *  So we need extra pipe transform
 */
export class AccessPipe implements PipeTransform {
  constructor(
    @Inject(REQUEST)
    private readonly request: FastifyRequest<any>
  ) {}

  async transform(value: any, metadata: ArgumentMetadata) {
    const role = this.request.user?.role;

    if (metadata.metatype && value instanceof metadata.metatype) {
      const newValue = classToClass(value, {
        groups: role && [role, ...permissonsMap[role]]
      });

      for (const k in newValue) {
        const key = k as keyof typeof newValue;
        if (newValue[key] === undefined) {
          delete newValue[key];
        }
      }

      return newValue;
    }

    return value;
  }
}
