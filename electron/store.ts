import type { Schema } from 'electron-store';
import * as z from 'zod';

const zodSchema = z.object({
  tab: z.number().default(0),
  setup: z
    .object({
      id: z.string(),
      rule: z.string(),
      priceList: z.array(z.number()),
    })
    .default({ id: '', rule: '', priceList: [50, 200] }),
  progress: z
    .object({
      fontSize: z.number(),
      donationList: z.array(
        z.object({
          receivedTime: z.iso.datetime(),
          amount: z.number(),
          username: z.string(),
          userId: z.string(),
          message: z.string(),
        }),
      ),
    })
    .default({ fontSize: 40, donationList: [] }),
  review: z
    .record(z.string(), z.record(z.string().trim(), z.number()))
    .default({}),
  pinball: z
    .object({
      rerollPrice: z.number(),
      timer: z.object({ minute: z.number(), second: z.number() }),
    })
    .default({ rerollPrice: 1000, timer: { minute: 2, second: 0 } }),
});

const jsonSchema = z.toJSONSchema(zodSchema);

export type StoreType = z.infer<typeof zodSchema>;

export const schema = jsonSchema.properties as Schema<StoreType>;
