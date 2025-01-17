import db from 'db';

import { resolver } from '@blitzjs/rpc';

export default resolver.pipe(resolver.authorize(['*', 'bde']), async () => {
  const [negatives, positives, neutral] = await Promise.all([
    await db.user.count({ where: { balance: { lt: 0 } } }),
    await db.user.count({ where: { balance: { gt: 0 } } }),
    await db.user.count({ where: { balance: { equals: 0 } } })
  ]);

  return {
    negatives,
    positives,
    neutral
  };
});
