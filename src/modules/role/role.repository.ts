import { Injectable } from '@nestjs/common';
import { ROLES } from 'src/enums/roles.enum';

@Injectable()
export class RoleRepository {
  constructor() {}

  getRoles(): any {
    return {
      [ROLES.ADMIN]: [ROLES.ADMIN, ROLES.JUN, ROLES.CUN],
      [ROLES.JUN]: [ROLES.JUN, ROLES.CUN],
      [ROLES.CUN]: [ROLES.CUN],
    };
  }
}
