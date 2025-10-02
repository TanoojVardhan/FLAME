'use client';

import { useFormStatus } from 'react-dom';
import { useActionState } from 'react';
import { useEffect, useRef } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { Flame, Heart, Users, Smile, Diamond, Frown, Home as HomeIcon, Loader2 } from 'lucide-react';
import { getFlamesResult } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import type { FlamesResult } from '@/lib/flames';

const initialState: {
  result?: FlamesResult;
  explanation?: string;
  error?: string;
  names?: { name1: string; name2: string };
} = {
  result: undefined,
  explanation: undefined,
  error: undefined,
  names: undefined,
};

const resultIcons: Record<FlamesResult, React.ElementType> = {
  Friends: Users,
  Love: Heart,
  Affection: Smile,
  Marriage: Diamond,
  Enemy: Frown,
  Siblings: HomeIcon,
  Fling: Flame,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <Loader2 className="animate-spin" />
      ) : (
        <>
          <Heart className="mr-2" />
          Calculate Relationship
        </>
      )}
    </Button>
  );
}

function ResultDisplay({ state }: { state: typeof initialState }) {
  if (!state.result) return null;

  const ResultIcon = resultIcons[state.result] || Flame;

  return (
    <Card className="animate-in fade-in-0 zoom-in-95 duration-500">
      <CardHeader className="items-center text-center">
        <CardDescription className="font-headline text-lg">
          {state.names?.name1} & {state.names?.name2}
        </CardDescription>
        <CardTitle className="font-headline text-2xl">Your result is...</CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <div className="flex flex-col items-center gap-4">
          <ResultIcon className="h-16 w-16 text-primary" />
          <p className="font-headline text-6xl font-bold tracking-tight text-foreground/90">
            {state.result}
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <p className="text-center text-muted-foreground">{state.explanation}</p>
      </CardFooter>
    </Card>
  );
}

export default function Home() {
  const [state, formAction] = useActionState(getFlamesResult, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.error) {
      toast({
        title: 'Error',
        description: state.error,
        variant: 'destructive',
      });
    }
  }, [state.error, toast]);


  // Save to Firestore on successful calculation
  useEffect(() => {
    async function saveToFirestore() {
      if (state.result && state.names && state.explanation) {
        try {
          await addDoc(collection(db, 'flames_results'), {
            name1: state.names.name1,
            name2: state.names.name2,
            result: state.result,
            explanation: state.explanation,
            createdAt: new Date(),
          });
        } catch (e) {
          // Optionally handle/log error
          console.error('Firestore save error:', e);
        }
      }
    }
    saveToFirestore();
  }, [state.result, state.names, state.explanation]);

  return (
    <main className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-md space-y-8">
        <header className="flex flex-col items-center text-center">
          <Flame className="h-16 w-16 text-primary" />
          <h1 className="mt-4 font-headline text-5xl font-bold tracking-tight text-foreground/90">
            FLAME
          </h1>
          <p className="mt-2 text-muted-foreground">
            Discover the spark between two names.
          </p>
        </header>

        <Card>
          <form action={formAction} ref={formRef}>
            <CardHeader>
              <CardTitle className="font-headline text-2xl">The FLAMES Game</CardTitle>
              <CardDescription>Enter two names to see what the future holds.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name1">Your Name</Label>
                <Input id="name1" name="name1" placeholder="e.g., Alex" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name2">Their Name</Label>
                <Input id="name2" name="name2" placeholder="e.g., Taylor" required />
              </div>
            </CardContent>
            <CardFooter>
              <SubmitButton />
            </CardFooter>
          </form>
        </Card>

        {state.result && <ResultDisplay state={state} />}
      </div>
    </main>
  );
}
