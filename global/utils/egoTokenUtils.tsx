import memoize from 'lodash/memoize';

import createEgoUtils from '@icgc-argo/ego-token-utils';
import { getConfig } from 'global/config';
import { EgoJwtData, UserWithId } from 'global/types';

const TokenUtils = createEgoUtils(getConfig().NEXT_PUBLIC_EGO_PUBLIC_KEY);

/* type PermissionScopeObj = {
  policy: string;
  permission: 'READ' | 'WRITE' | 'ADMIN' | 'DENY';
}; */

export const decodeToken = memoize((egoJwt?: string) =>
  egoJwt ? TokenUtils.decodeToken(egoJwt) : null,
);

export const isValidJwt = (egoJwt?: string) => !!egoJwt && TokenUtils.isValidJwt(egoJwt);

export const extractUser: (decodedToken: EgoJwtData) => UserWithId | undefined = (decodedToken) => {
  if (decodedToken) {
    return {
      ...decodedToken?.context.user,
      scope: decodedToken?.context.scope || [],
      id: decodedToken?.sub,
    };
  }
  return undefined;
};

export const getPermissionsFromToken: (egoJwt: string) => string[] = (egoJwt) =>
  isValidJwt(egoJwt) ? TokenUtils.getPermissionsFromToken(egoJwt) : [];

export const isDacoAdmin = (permissions: string[]): boolean => TokenUtils.isDacoAdmin(permissions);

export const hasDacoScope = (permissions: string[]): boolean =>
  permissions.includes(`DACO.WRITE`) || permissions.includes(`DACO.READ`);
