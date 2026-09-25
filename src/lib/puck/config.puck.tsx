import type { Config, Data } from "@puckeditor/core";
import { z } from "zod";

export const componentPropsSchemas = z.object({
	HeadingBlock: z.object({
		title: z.string(),
	}),
	Button: z.object({
		title: z.string(),
	}),
});

type Props = z.infer<typeof componentPropsSchemas>;

const config: Config<Props> = {
	components: {
		HeadingBlock: {
			fields: {
				title: { type: "text" },
			},
			defaultProps: {
				title: "Heading",
			},
			render: ({ title }) => (
				<div style={{ padding: 64 }}>
					<h1>{title}</h1>
				</div>
			),
		},
		Button: {
			fields: {
				title: { type: "text" },
			},
			defaultProps: {
				title: "Click",
			},
			render: ({ title }) => <div style={{ padding: 64 }}>{title}</div>,
		},
	},
};

const componentContentSchemas = Object.entries(componentPropsSchemas.shape).map(([type, schema]) =>
	z.object({
		type: z.literal(type),
		props: schema.extend({ id: z.string() }),
	}),
);

const contentItemSchema = z.discriminatedUnion(
	"type",
	componentContentSchemas as [(typeof componentContentSchemas)[number], ...(typeof componentContentSchemas)[number][]],
);

export const puckDataSchema = z.object({
	root: z.object({ props: z.object({ title: z.string() }).partial().optional() }).loose(),
	content: z.array(contentItemSchema),
	zones: z.record(z.string(), z.array(contentItemSchema)).optional(),
}) satisfies z.ZodType<Partial<Data>>;

export const pageTitleSchema = z.string().trim().min(1, "Enter a title.").max(80, "Use at most 80 characters.");

export const pagePathSchema = z
	.string()
	.trim()
	.toLowerCase()
	.transform((value) => (value.startsWith("/") ? value : `/${value}`))
	.transform((value) => (value.length > 1 ? value.replace(/\/+$/, "") : value))
	.refine(
		(value) => value === "/" || /^\/[a-z0-9]+(?:-[a-z0-9]+)*(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)*$/.test(value),
		"Use lowercase letters, numbers, hyphens and slashes only.",
	);

/** Derives a URL path from a title as the user types, e.g. "About Us" -> "/about-us". */
export const slugifyToPath = (title: string) => {
	const slug = title
		.trim()
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");
	return slug ? `/${slug}` : "/";
};

export default config;
