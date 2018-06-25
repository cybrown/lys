import { Nodes } from '../nodes';
import { walkPreOrder } from '../walker';
import { findParentType } from './helpers';
// import { FunctionType } from '../types';
// import { annotations } from '../annotations';
// import { last } from '../helpers';

const fixParents = walkPreOrder((node: Nodes.Node, _: Nodes.DocumentNode, parent: Nodes.Node) => {
  node.parent = parent;
  return node;
});

const resolveLocals = walkPreOrder(
  (node: Nodes.Node) => {
    if (node instanceof Nodes.MatchNode) {
      // create a local for lhs of MatchNode

      /**
       *   aFunction(123) match { ... }
       *   ^^^^^^^^^^^^^^ this part will get its own local
       */
      const fn = findParentType(node, Nodes.FunctionNode);

      node.local = fn.addLocal(node.lhs.ofType);
    }
  },
  (node: Nodes.Node) => {
    if (node instanceof Nodes.MatchNode) {
      // release the local for lhs of MatchNode

      if (node.local) {
        const fn = findParentType(node, Nodes.FunctionNode);
        fn.freeTempLocal(node.local);
      }
    }
  }
);

// export const detectTailCall = walkPreOrder((node: Nodes.Node) => {
//   if (node instanceof Nodes.FunctionNode) {
//     const isTailRec = isRecursiveCallExpression(node, node.body);

//     if (isTailRec) {
//       node.annotate(new annotations.IsTailRec());

//       const tailRecLoop = new Nodes.TailRecLoopNode();
//       {
//         tailRecLoop.body = node.body;
//       }

//       const targetLocal = node.addLocal(node.functionReturnType.ofType);

//       const lastNode = new Nodes.GetLocalNode();
//       {
//         lastNode.local = targetLocal;
//         lastNode.ofType = node.functionReturnType.ofType;
//       }

//       const block = (node.body = new Nodes.BlockNode());
//       block.statements = [tailRecLoop, lastNode];
//       block.annotate(new annotations.IsValueNode());
//       block.ofType = lastNode.ofType;

//       walkPreOrder((child: Nodes.Node) => {
//         const ann = child.getAnnotation(annotations.IsReturnExpression);
//         if (ann) {
//           ann.targetLocal = targetLocal;
//         }
//       })(node as any);

//       block.annotate(new annotations.IsReturnExpression());
//     }
//   }
// });

// function annotateReturnExpressions(node: Nodes.Node) {
//   if (node instanceof Nodes.MatchNode) {
//     node.matchingSet.forEach($ => annotateReturnExpressions($.rhs));
//   } else if (node instanceof Nodes.IfNode) {
//     node.annotate(new annotations.IsReturnExpression());
//     // annotateReturnExpressions(last(node.truePart));
//     // annotateReturnExpressions(last(node.falsePart));

//     // if (
//     //   last(node.truePart).hasAnnotation(annotations.IsReturnExpression) &&
//     //   last(node.falsePart).hasAnnotation(annotations.IsReturnExpression)
//     // ) {
//     //   // TODO: unify types
//     //   last(node.truePart).removeAnnotation(annotations.IsReturnExpression);
//     //   last(node.falsePart).removeAnnotation(annotations.IsReturnExpression);
//     //   node.annotate(new annotations.IsReturnExpression());
//     // }
//   } else {
//     node.annotate(new annotations.IsReturnExpression());
//   }
// }

// // find the last expression of every function body and mark the return expressions
// const detectReturnExpressions = walkPreOrder((node: Nodes.Node) => {
//   if (node instanceof Nodes.FunctionNode) {
//     annotateReturnExpressions(node.body);
//   }
// });

// /**
//  * Returns true if the node is a recursive call to the specified function identifier
//  *
//  * @param functionNode The function identifier
//  * @param node               The node to check
//  * @return True if it is a recursive call to that
//  */
// function isRecursiveCallExpression(functionNode: Nodes.FunctionNode, node: Nodes.ExpressionNode): boolean {
//   if (node instanceof Nodes.FunctionCallNode) {
//     return isRecursiveFunctionCall(functionNode, node);
//   }

//   if (node instanceof Nodes.BlockNode) {
//     return isRecursiveCallExpression(functionNode, last(node.statements));
//   }

//   if (node instanceof Nodes.IfNode) {
//     const truePart = isRecursiveCallExpression(functionNode, node.truePart);
//     const falsePart = isRecursiveCallExpression(functionNode, node.falsePart);
//     return truePart || falsePart;
//   }

//   if (node instanceof Nodes.MatchNode) {
//     return node.matchingSet.some(pattern => {
//       return isRecursiveCallExpression(functionNode, pattern.rhs);
//     });
//   }

//   return false;
// }

// function isRecursiveFunctionCall(_functionNode: Nodes.FunctionNode, fcn: Nodes.FunctionCallNode) {
//   if (fcn.functionNode instanceof Nodes.VariableReferenceNode) {
//     // Make sure the variable reference points to the same function
//     const referencedType = fcn.functionNode.ofType;

//     const functionNode = findParentType(fcn, Nodes.FunctionNode);

//     if (referencedType instanceof FunctionType) {
//       const isTailRec = referencedType.internalName === functionNode.internalIdentifier;

//       if (isTailRec) {
//         fcn.annotate(new annotations.IsTailRecCall());
//         fcn.removeAnnotation(annotations.IsReturnExpression);
//       }

//       return isTailRec;
//     }
//   }
//   return false;
// }

export function compilationPhase(node: Nodes.DocumentNode): Nodes.DocumentNode {
  fixParents(node, node, null);
  resolveLocals(node, node, null);
  // detectReturnExpressions(node);
  // detectTailCall(node);
  fixParents(node, node, null);

  return node;
}