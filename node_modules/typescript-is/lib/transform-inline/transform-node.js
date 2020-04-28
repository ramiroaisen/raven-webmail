"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const ts = require("typescript");
const visitor_type_check_1 = require("./visitor-type-check");
const VisitorUtils = require("./visitor-utils");
const utils_1 = require("./utils");
function createArrowFunction(type, rootName, optional, partialVisitorContext) {
    const functionMap = new Map();
    const functionNames = new Set();
    const visitorContext = Object.assign(Object.assign({}, partialVisitorContext), { functionNames, functionMap });
    const functionName = partialVisitorContext.options.shortCircuit
        ? visitor_type_check_1.visitShortCircuit(visitorContext)
        : (optional
            ? visitor_type_check_1.visitUndefinedOrType(type, visitorContext)
            : visitor_type_check_1.visitType(type, visitorContext));
    const errorIdentifier = ts.createIdentifier('error');
    const declarations = utils_1.sliceMapValues(functionMap);
    return ts.createArrowFunction(undefined, undefined, [
        ts.createParameter(undefined, undefined, undefined, VisitorUtils.objectIdentifier, undefined, ts.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword))
    ], undefined, undefined, ts.createBlock([
        ts.createVariableStatement([ts.createModifier(ts.SyntaxKind.ConstKeyword)], [ts.createVariableDeclaration(VisitorUtils.pathIdentifier, undefined, ts.createArrayLiteral([ts.createStringLiteral(rootName)]))]),
        ...declarations,
        ts.createVariableStatement([ts.createModifier(ts.SyntaxKind.ConstKeyword)], [ts.createVariableDeclaration(errorIdentifier, undefined, ts.createCall(ts.createIdentifier(functionName), undefined, [VisitorUtils.objectIdentifier]))]),
        ts.createReturn(errorIdentifier)
    ]));
}
function transformDecorator(node, parameterType, parameterName, optional, visitorContext) {
    if (ts.isCallExpression(node.expression)) {
        const signature = visitorContext.checker.getResolvedSignature(node.expression);
        if (signature !== undefined
            && signature.declaration !== undefined
            && path.resolve(signature.declaration.getSourceFile().fileName) === path.resolve(path.join(__dirname, '..', '..', 'index.d.ts'))
            && node.expression.arguments.length <= 1) {
            const arrowFunction = createArrowFunction(parameterType, parameterName, optional, visitorContext);
            const expression = ts.updateCall(node.expression, node.expression.expression, undefined, [arrowFunction].concat(node.expression.arguments));
            return ts.updateDecorator(node, expression);
        }
    }
    return node;
}
/** Figures out an appropriate human-readable name for the variable designated by `node`. */
function extractVariableName(node) {
    return node != null && ts.isIdentifier(node) ? node.escapedText.toString() : '$';
}
function transformNode(node, visitorContext) {
    if (ts.isParameter(node) && node.type !== undefined && node.decorators !== undefined) {
        const type = visitorContext.checker.getTypeFromTypeNode(node.type);
        const required = !node.initializer && !node.questionToken;
        const mappedDecorators = node.decorators.map((decorator) => transformDecorator(decorator, type, extractVariableName(node.name), !required, visitorContext));
        return ts.updateParameter(node, mappedDecorators, node.modifiers, node.dotDotDotToken, node.name, node.questionToken, node.type, node.initializer);
    }
    else if (ts.isCallExpression(node)) {
        const signature = visitorContext.checker.getResolvedSignature(node);
        if (signature !== undefined
            && signature.declaration !== undefined
            && path.resolve(signature.declaration.getSourceFile().fileName) === path.resolve(path.join(__dirname, '..', '..', 'index.d.ts'))
            && node.typeArguments !== undefined
            && node.typeArguments.length === 1) {
            const name = visitorContext.checker.getTypeAtLocation(signature.declaration).symbol.name;
            const isEquals = name === 'equals' || name === 'createEquals' || name === 'assertEquals' || name === 'createAssertEquals';
            const typeArgument = node.typeArguments[0];
            const type = visitorContext.checker.getTypeFromTypeNode(typeArgument);
            const arrowFunction = createArrowFunction(type, extractVariableName(node.arguments[0]), false, Object.assign(Object.assign({}, visitorContext), { options: Object.assign(Object.assign({}, visitorContext.options), { disallowSuperfluousObjectProperties: isEquals || visitorContext.options.disallowSuperfluousObjectProperties }) }));
            return ts.updateCall(node, node.expression, node.typeArguments, [
                ...node.arguments,
                arrowFunction
            ]);
        }
    }
    return node;
}
exports.transformNode = transformNode;
//# sourceMappingURL=transform-node.js.map