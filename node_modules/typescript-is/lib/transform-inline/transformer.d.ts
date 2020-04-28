import * as ts from 'typescript';
export default function transformer(program: ts.Program, options?: {
    [Key: string]: unknown;
}): ts.TransformerFactory<ts.SourceFile>;
