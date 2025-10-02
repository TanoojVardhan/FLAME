'use server';

import { z } from 'zod';
import { calculateFlames, type FlamesResult } from '@/lib/flames';
import { explainFlamesResult } from '@/ai/flows/explain-flames-result';
import { saveFlamesSubmission } from '@/lib/firestore-server';

const formSchema = z.object({
  name1: z.string().min(1, 'Please enter your name.'),
  name2: z.string().min(1, 'Please enter their name.'),
});

interface FlamesState {
  result?: FlamesResult;
  explanation?: string;
  error?: string;
  names?: { name1: string; name2: string };
}

export async function getFlamesResult(
  prevState: FlamesState,
  formData: FormData
): Promise<FlamesState> {
  const validatedFields = formSchema.safeParse({
    name1: formData.get('name1'),
    name2: formData.get('name2'),
  });

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors.name1?.[0] || validatedFields.error.flatten().fieldErrors.name2?.[0] || "Invalid input."
    };
  }

  const { name1, name2 } = validatedFields.data;

  try {
    const flamesResult = calculateFlames(name1, name2);

    let explanation: string;
    if (name1.trim().toLowerCase() === name2.trim().toLowerCase()) {
      explanation = `Of course, it's ${flamesResult}! You've entered the same name twice. True self-discovery! For a relationship reading, try two different names.`;
      // Store in Firestore
      await saveFlamesSubmission({ name1, name2, result: flamesResult, explanation });
      return {
        result: flamesResult,
        explanation,
        names: { name1, name2 },
      };
    }

    const aiExplanation = await explainFlamesResult({
      name1,
      name2,
      flamesResult,
    });
    explanation = aiExplanation.explanation;
    // Store in Firestore
    await saveFlamesSubmission({ name1, name2, result: flamesResult, explanation });
    return {
      result: flamesResult,
      explanation,
      names: { name1, name2 },
    };
  } catch (e) {
    console.error(e);
    return {
      error: 'The relationship spirits are busy at the moment. Please try again later.',
    };
  }
}
