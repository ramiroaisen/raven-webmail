import * as ts from 'typescript';
import { VisitorContext } from './visitor-context';
export declare function visitType(type: ts.Type, visitorContext: VisitorContext): string;
export declare function visitUndefinedOrType(type: ts.Type, visitorContext: VisitorContext): string;
export declare function visitShortCircuit(visitorContext: VisitorContext): string;
