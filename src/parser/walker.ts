import { IToken, TokenError } from 'ebnf';

export function walker<T extends { errors: any[]; children: any[] } = IToken, D = any>(
  cb: (node: T, document: D) => void | T
) {
  const leFn = function(node: T, document?: D) {
    if (node) {
      let res = null;
      try {
        res = cb.call(this, node, document);
      } catch (e) {
        node.errors.push(new TokenError(e.message, node as any));
      }

      if (node.children) {
        for (let i = 0; i < node.children.length; i++) {
          if (node.children[i]) {
            let res1 = leFn.call(this, node.children[i], document);
            node.children[i] = res1;
          }
        }
      }

      return res;
    }
  };

  return leFn;
}