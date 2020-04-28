import * as ts from 'typescript';
import { PartialVisitorContext } from './visitor-context';
export declare function transformNode(node: ts.Node, visitorContext: PartialVisitorContext): ts.Node;
