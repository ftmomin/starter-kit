import { type ReactNode } from 'react';
import {
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form';

export type ThemeColor =
  | 'blue'
  | 'green'
  | 'red'
  | 'yellow'
  | 'purple'
  | 'pink';

export type FormControlProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues,
> = {
  name: TName;
  label: ReactNode;
  description?: ReactNode;
  control: ControllerProps<TFieldValues, TName, TTransformedValues>['control'];
};

import { TOrgRoles } from './database.type';

export interface TOrgSettings {
  defaultRole: TOrgRoles;
  allowInvites: boolean;
}

export interface TOrgMetadata {
  address: string | null;
  website: string | null;
  phone: string | null;
  mobile: string | null;
  email: string | null;
}

export interface TUserMetadata {
  mobile: string | null;
}

export interface TUserSettings {
  timezone: string;
  themeMode: 'light' | 'dark';
  themeUiColorMode: 'default' | 'blue' | 'green';
}
