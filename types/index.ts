import { z } from "zod";

export const tourDetailSchema = z.object({
  title: z.string(),
  slug: z.string(),
  description: z.string(),
  overview: z.string(),
  price: z.number(),
  duration: z.number(),
  groupSize: z.string(),
  difficulty: z.string(),
  category: z.string(),
  bestSeason: z.string(),
  image: z.string().nullable(),
  inclusions: z.string().array(),
  exclusions: z.string().array(),
  seoTitle: z.string().nullable(),
  seoDescription: z.string().nullable(),
});

export type Tour = z.infer<typeof tourDetailSchema> & {
  id: string;
  destinationId?: string | null;
};

export type Destination = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image?: string | null;
};

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  image?: string | null;
};

export type BookingInquiry = {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  tourTitle?: string | null;
};
