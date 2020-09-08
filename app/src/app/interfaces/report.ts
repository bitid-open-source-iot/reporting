import { User } from './user';

export interface Report {
    'role'?: number;
    'users'?: User[];
    'reportId'?: number;
    'description'?: string;
}