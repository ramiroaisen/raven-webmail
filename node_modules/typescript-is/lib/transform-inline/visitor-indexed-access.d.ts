import * as ts from 'typescript';
import { VisitorContext } from './visitor-context';
export declare function visitType(type: ts.Type, indexType: ts.Type, visitorContext: VisitorContext): string;
