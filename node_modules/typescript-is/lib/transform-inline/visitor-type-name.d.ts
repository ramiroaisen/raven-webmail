import * as ts from 'typescript';
import { VisitorContext } from './visitor-context';
interface TypeCheckNameMode {
    type: 'type-check';
    superfluousPropertyCheck?: boolean;
}
interface KeyofNameMode {
    type: 'keyof';
}
interface IndexedAccessNameMode {
    type: 'indexed-access';
    indexType: ts.Type;
}
declare type NameMode = TypeCheckNameMode | KeyofNameMode | IndexedAccessNameMode;
export declare function visitType(type: ts.Type, visitorContext: VisitorContext, mode: NameMode): string;
export {};
