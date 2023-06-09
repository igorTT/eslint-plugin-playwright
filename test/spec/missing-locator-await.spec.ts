import { runRuleTester, test } from '../utils/rule-tester';
import rule from '../../src/rules/missing-locator-await';
import * as dedent from 'dedent';

runRuleTester('missing-locator-await', rule, {
  valid: [{ code: test('await page.locator("foo").click()') }],
  invalid: [
    {
      code: test('page.locator("foo").click()'),
      output: test('await page.locator("foo").click()'),
      errors: [
        {
          messageId: 'page',
          line: 1,
          column: 1,
          endLine: 1,
          endColumn: 4,
        },
      ],
    },
  ],
});
