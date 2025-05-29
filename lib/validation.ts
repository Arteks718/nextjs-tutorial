import { z as zod } from "zod";
export const formSchema = zod.object({
	title: zod.string().min(3).max(100),
	description: zod.string().min(20).max(500),
	category: zod.string().min(3).max(30),
	link: zod
		.string()
		.url()
		.refine(async (url) => {
			try {
				const res = await fetch(url, {
					method: "HEAD",
				});
				const contentType = res.headers.get("content-type");

				return contentType?.startsWith("image/");
			} catch {
				return false;
			}
      
		}),
    pitch: zod.string().min(10)
});
