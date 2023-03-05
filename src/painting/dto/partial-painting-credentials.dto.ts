import { PartialType } from '@nestjs/mapped-types';

import { PaintingCredentialsDto } from './painting-credentials.dto';

export class PartialPaintingCredentialsDto extends PartialType(
  PaintingCredentialsDto,
) {}
