// src/ai/flows/render-outfit.ts
'use server';

/**
 * @fileOverview Renders a selected outfit on a user-provided image using AI.
 *
 * - renderOutfitOnUserImage - A function that handles the outfit rendering process.
 * - RenderOutfitOnUserImageInput - The input type for the renderOutfitOnUserImage function.
 * - RenderOutfitOnUserImageOutput - The return type for the renderOutfitOnUserImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RenderOutfitOnUserImageInputSchema = z.object({
  userImage: z
    .string()
    .describe(
      "A photo of the user, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  outfitImage: z
    .string()
    .describe(
      "A photo of the outfit, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  customizations: z
    .string()
    .optional()
    .describe('Optional customizations to apply to the outfit.'),
});
export type RenderOutfitOnUserImageInput = z.infer<typeof RenderOutfitOnUserImageInputSchema>;

const RenderOutfitOnUserImageOutputSchema = z.object({
  renderedImage: z
    .string()
    .describe(
      "A photo of the user with the outfit rendered on them, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  description: z
    .string()
    .describe('A textual description of the rendered image.'),
});
export type RenderOutfitOnUserImageOutput = z.infer<typeof RenderOutfitOnUserImageOutputSchema>;

export async function renderOutfitOnUserImage(input: RenderOutfitOnUserImageInput): Promise<RenderOutfitOnUserImageOutput> {
  return renderOutfitOnUserImageFlow(input);
}

const renderOutfitPrompt = ai.definePrompt({
  name: 'renderOutfitPrompt',
  input: {schema: RenderOutfitOnUserImageInputSchema},
  output: {schema: RenderOutfitOnUserImageOutputSchema},
  prompt: `You are an AI fashion assistant that can render outfits on user images.

You will take the user's image and the outfit image and render the outfit on the user.

User Image: {{media url=userImage}}
Outfit Image: {{media url=outfitImage}}

{{#if customizations}}
Customizations: {{{customizations}}}
{{/if}}

Create a photorealistic image of the user wearing the outfit, taking into account any customizations.

Output the rendered image as a data URI.
Also, output a description of the rendered image.`, // Ensure media URLs are correctly passed
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_ONLY_HIGH',
      },
    ],
  },
});

const renderOutfitOnUserImageFlow = ai.defineFlow(
  {
    name: 'renderOutfitOnUserImageFlow',
    inputSchema: RenderOutfitOnUserImageInputSchema,
    outputSchema: RenderOutfitOnUserImageOutputSchema,
  },
  async input => {
    const {media, text} = await ai.generate({
      prompt: [
        {media: {url: input.userImage}},
        {media: {url: input.outfitImage}},
        {text: `Render the outfit on the user with the following customizations: ${input.customizations || 'no customizations'}`},
      ],
      model: 'googleai/gemini-2.0-flash-exp',
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    return {renderedImage: media.url, description: text!};
  }
);

