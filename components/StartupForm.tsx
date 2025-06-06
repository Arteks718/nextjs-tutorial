"use client";
import { useState, useActionState } from "react";
import MDEditor from "@uiw/react-md-editor";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Send } from "lucide-react";
import { formSchema } from "@/lib/validation";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { createPitch } from "@/lib/actions";

const StartupForm = () => {
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [pitch, setPitch] = useState<string>("");
	const { toast } = useToast();
	const router = useRouter();

	const handleSubmit = async (prevState: any, formData: FormData) => {
		try {
			const formValues = {
				title: formData.get("title") as string,
				description: formData.get("description") as string,
				category: formData.get("category") as string,
				link: formData.get("link") as string,
				pitch,
			};

			await formSchema.parseAsync(formValues);

			const result = await createPitch(prevState, formData, pitch);

			if (result.status == "SUCCESS") {
				toast({
					title: "Startup Submitted",
					description: "Your startup has been successfully submitted!",
				});
				router.push(`/startup/${result._id}`);
			}
			return result;
		} catch (error) {
			if (error instanceof z.ZodError) {
				const fieldErrors = error.flatten().fieldErrors;
				setErrors(fieldErrors as unknown as Record<string, string>);

        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "There was a problem with your request.",
        })

				return {
					...prevState,
					error: "Validation failed",
					status: "ERROR",
					payload: formData,
				};
			}

			toast({
				variant: "destructive",
				title: "Error",
				description: "An unexpected error occurred",
			});
			return {
				...prevState,
				error: "An unexpected error occurred",
				status: "ERROR",
				payload: formData,
			};
		}
	};

	const [actionState, formAction, isPending] = useActionState(handleSubmit, {
		error: "",
		status: "INITIAL",
	});

	return (
		<form action={formAction} className='startup-form'>
			<div>
				<label htmlFor='title' className='startup-form_label'>
					Title
				</label>
				<Input
					id='title'
					name='title'
					className='startup-form_input'
					required
					placeholder='Startup Title'
					defaultValue={actionState.payload?.get("title") || ""}
				/>
				{errors.title && <p className='startup-form_error'>{errors.title}</p>}
			</div>

			<div>
				<label htmlFor='description' className='startup-form_label'>
					Description
				</label>
				<Textarea
					id='description'
					name='description'
					className='startup-form_textarea'
					required
					placeholder='Startup Description'
					defaultValue={actionState.payload?.get("description") || ""}
				/>
				{errors.description && (
					<p className='startup-form_error'>{errors.description}</p>
				)}
			</div>

			<div>
				<label htmlFor='category' className='startup-form_label'>
					Category
				</label>
				<Input
					id='category'
					name='category'
					className='startup-form_input'
					required
					placeholder='Startup Category (Tech, Health, etc.)'
					defaultValue={actionState.payload?.get("category") || ""}
				/>
				{errors.category && (
					<p className='startup-form_error'>{errors.category}</p>
				)}
			</div>

			<div>
				<label htmlFor='link' className='startup-form_label'>
					Image URL
				</label>
				<Input
					id='link'
					name='link'
					className='startup-form_input'
					required
					placeholder='Startup Image URL'
					defaultValue={actionState.payload?.get("link") || ""}
				/>
				{errors.link && <p className='startup-form_error'>{errors.link}</p>}
			</div>

			<div data-color-mode='light'>
				<label htmlFor='pitch' className='startup-form_label'>
					Pitch
				</label>
				<MDEditor
					value={pitch}
					onChange={(value) => setPitch(value as string)}
					className='startup-form_editor'
					id='pitch'
					preview='edit'
					height={300}
					style={{ borderRadius: 20, overflow: "hidden" }}
					textareaProps={{
						placeholder:
							"Briefly describe your idea and what problem it solves...",
					}}
					previewOptions={{
						disallowedElements: ["style"],
					}}
				/>

				{errors.pitch && <p className='startup-form_error'>{errors.pitch}</p>}
			</div>

			<Button
				type='submit'
				className='startup-form_btn text-white'
				disabled={isPending}
			>
				{isPending ? "Submitting..." : "Submit Startup"}
				<Send className='size-6 ml-2' />
			</Button>
		</form>
	);
};

export default StartupForm;
