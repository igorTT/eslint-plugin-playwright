import { CallExpression } from 'estree';
import { Rule } from 'eslint';

import {
  getMatchers,
  isPropertyAccessor,
  getExpectType,
  isIdentifier,
  getStringValue,
  isLocatorMethod,
} from '../utils/ast';

const validTypes = new Set(['AwaitExpression']);

const expectedPlaywrightMatchers = ['click'];

const playwrightTestMatchers = ['click'];

const getCallType = (
  node: CallExpression & Rule.NodeParentExtension,
  awaitableMatchers: Set<string>
) => {
  const expectType = isLocatorMethod(node, 'click');
  console.log('node', node);
  console.log('expectType', expectType);
  if (!expectType) return;

  const [lastMatcher] = getMatchers(node).slice(-1);
  const matcherName = getStringValue(lastMatcher);

  if (awaitableMatchers.has(matcherName)) {
    return { messageId: 'page', data: { matcherName } };
  }
};

export default {
  create(context) {
    const options = context.options[0] || {};
    console.log(options);
    const awaitableMatchers = new Set([
      ...expectedPlaywrightMatchers,
      ...playwrightTestMatchers,
      ...(options.awaitableMatchers || []),
    ]);

    return {
      CallExpression(node) {
        const callType = getCallType(node, awaitableMatchers);
        // console.log(node, awaitableMatchers);
        if (!callType) return;
        console.log('callType', callType);

        context.report({
          messageId: callType.messageId,
          data: callType.data,
          node,
        });
      },
    };
  },
} as Rule.RuleModule;
