import { PartialType } from '@nestjs/mapped-types';
import { CreateUsersDto } from './create-users.dto';

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
export class UpdateUsersDto extends PartialType(CreateUsersDto) {}
