import { ResponseOjbect } from '../models/network-response-object.model';

export type ICallback = (error?: any, result?: ResponseOjbect<any> | any) => void;
