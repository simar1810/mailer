'use client';

import type { FC } from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Wand2, Send, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { ComposeEmailSchema, type ComposeEmailFormValues } from '@/lib/schemas';
import { useToast } from '@/hooks/use-toast';
import { generateEmailContentAction } from '@/actions/ai-actions';
import { sendEmailAction } from '@/actions/email-actions';

interface ComposeEmailFormProps {}

const ComposeEmailForm: FC<ComposeEmailFormProps> = () => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const form = useForm<ComposeEmailFormValues>({
    resolver: zodResolver(ComposeEmailSchema),
    defaultValues: {
      recipient: '',
      subject: '',
      titlePrompt: '',
      body: '',
    },
  });

  const handleGenerateContent = async () => {
    const titlePromptValue = form.getValues('titlePrompt');
    if (!titlePromptValue) {
      toast({
        variant: 'destructive',
        title: 'Prompt Required',
        description: 'Please enter a title/prompt for AI content generation.',
      });
      return;
    }

    setIsGenerating(true);
    try {
      const result = await generateEmailContentAction({ prompt: titlePromptValue });
      if ('error' in result) {
        toast({
          variant: 'destructive',
          title: 'AI Generation Failed',
          description: result.error,
        });
      } else {
        form.setValue('subject', result.subject, { shouldValidate: true });
        form.setValue('body', result.body, { shouldValidate: true });
        // form.setValue('titlePrompt', result.title); // Optionally update title if AI provides one different from prompt
        toast({
          title: 'Content Generated',
          description: 'Subject and body have been populated by AI.',
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'AI Generation Error',
        description: error instanceof Error ? error.message : 'An unknown error occurred.',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const onSubmit = async (values: ComposeEmailFormValues) => {
    setIsSending(true);
    try {
      const result = await sendEmailAction({
        recipient: values.recipient,
        subject: values.subject,
        textBody: values.body, // Simple text body for this form
      });

      if (result.success) {
        toast({
          title: 'Email Sent!',
          description: result.message,
        });
        form.reset();
      } else {
        toast({
          variant: 'destructive',
          title: 'Failed to Send Email',
          description: result.error,
        });
      }
    } catch (error) {
       toast({
        variant: 'destructive',
        title: 'Sending Error',
        description: error instanceof Error ? error.message : 'An unknown error occurred.',
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-1">
        <FormField
          control={form.control}
          name="recipient"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Recipient Email</FormLabel>
              <FormControl>
                <Input placeholder="recipient@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject</FormLabel>
              <FormControl>
                <Input placeholder="Email Subject" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="titlePrompt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Main Idea / Prompt for AI</FormLabel>
              <FormControl>
                <Input placeholder="e.g., New product launch announcement" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="relative">
           <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleGenerateContent}
            disabled={isGenerating || isSending}
            className="absolute top-[-35px] right-0 flex items-center gap-2 bg-accent text-accent-foreground hover:bg-accent/90"
          >
            {isGenerating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Wand2 className="h-4 w-4" />
            )}
            Generate with AI
          </Button>
          <FormField
            control={form.control}
            name="body"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Body</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write your email content here, or let AI help you..."
                    className="min-h-[200px] resize-y"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={isSending || isGenerating} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
          {isSending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Send className="mr-2 h-4 w-4" />
          )}
          Send Email
        </Button>
      </form>
    </Form>
  );
};

export default ComposeEmailForm;
