/* eslint-disable @typescript-eslint/no-empty-interface */

import { PartialType } from '@nestjs/mapped-types';

// create-dto.interface.ts
export class GenericCreateDto {
  // Propiedades requeridas para el DTO de creación
}

// update-dto.class.ts
export class GenericUpdateDto extends PartialType(GenericCreateDto) {
  // Propiedades requeridas para el DTO de actualización
}
