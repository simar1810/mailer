'use client';

import type { FC } from 'react';
import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UploadCloud, Sparkles, Send, Loader2, FileText, CheckCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UploadHtmlEmailSchema, type UploadHtmlEmailFormValues } from '@/lib/schemas';
import { useToast } from '@/hooks/use-toast';
import { optimizeHtmlAction } from '@/actions/ai-actions';
import { sendEmailAction } from '@/actions/email-actions';

interface UploadHtmlFormProps {}

const UploadHtmlForm: FC<UploadHtmlFormProps> = () => {
  const { toast } = useToast();
  const [htmlContent, setHtmlContent] = useState<string | null>(null);
  const [optimizedSummary, setOptimizedSummary] = useState<string | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);


  const form = useForm<UploadHtmlEmailFormValues>({
    resolver: zodResolver(UploadHtmlEmailSchema),
    defaultValues: {
      recipient: '',
      subject: '',
    },
  });

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === "text/html") {
        setFileName(file.name);
        const reader = new FileReader();
        reader.onload = (e) => {
          setHtmlContent(e.target?.result as string);
          setOptimizedSummary(null); // Reset summary on new file
        };
        reader.readAsText(file);
        form.setValue('htmlFile', event.target.files as FileList, { shouldValidate: true });
      } else {
        toast({
          variant: 'destructive',
          title: 'Invalid File Type',
          description: 'Please upload an HTML file (.html).',
        });
        setHtmlContent(null);
        setFileName(null);
        setOptimizedSummary(null);
        if(fileInputRef.current) fileInputRef.current.value = ''; // Reset file input
        form.resetField('htmlFile');
      }
    }
  };
  
  const handleOptimizeHtml = async () => {
    if (!htmlContent) {
      toast({
        variant: 'destructive',
        title: 'No HTML Content',
        description: 'Please upload an HTML file first.',
      });
      return;
    }

    setIsOptimizing(true);
    try {
      const result = await optimizeHtmlAction({ htmlContent });
      if ('error' in result) {
        toast({
          variant: 'destructive',
          title: 'Optimization Failed',
          description: result.error,
        });
      } else {
        setHtmlContent(result.optimizedHtml);
        setOptimizedSummary(result.optimizationSummary);
        toast({
          title: 'HTML Optimized',
          description: 'HTML content has been optimized for email clients.',
        });
      }
    } catch (error) {
       toast({
        variant: 'destructive',
        title: 'Optimization Error',
        description: error instanceof Error ? error.message : 'An unknown error occurred.',
      });
    } finally {
      setIsOptimizing(false);
    }
  };


  const onSubmit = async (values: UploadHtmlEmailFormValues) => {
    if (!htmlContent) {
      toast({
        variant: 'destructive',
        title: 'No HTML Content',
        description: 'Please upload and optionally optimize an HTML file.',
      });
      return;
    }
    setIsSending(true);
    try {
      const result = await sendEmailAction({
        recipient: values.recipient,
        subject: values.subject,
        htmlBody: htmlContent,
      });

      if (result.success) {
        toast({
          title: 'Email Sent!',
          description: result.message,
        });
        form.reset();
        setHtmlContent(null);
        setFileName(null);
        setOptimizedSummary(null);
        if(fileInputRef.current) fileInputRef.current.value = '';
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
          name="htmlFile"
          render={() => ( // field is not directly used for input type file with react-hook-form like this
            <FormItem>
              <FormLabel>HTML File</FormLabel>
              <FormControl>
                 <Input 
                  type="file" 
                  accept=".html" 
                  onChange={handleFileChange}
                  ref={fileInputRef} 
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {fileName && !htmlContent && <p className="text-sm text-muted-foreground">Error reading file. Please try again.</p>}
        
        {htmlContent && (
          <Card className="mt-4 bg-secondary/50">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <FileText className="mr-2 h-5 w-5 text-primary" /> HTML Preview & Optimization
              </CardTitle>
              <CardDescription>
                {fileName ? `Loaded: ${fileName}` : 'HTML content loaded.'}
                {optimizedSummary && <span className="text-green-600 font-semibold"> (Optimized)</span>}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleOptimizeHtml}
                disabled={isOptimizing || isSending || !htmlContent}
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
              >
                {isOptimizing ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                Optimize HTML with AI
              </Button>
              {optimizedSummary && (
                <div className="p-3 border rounded-md bg-background">
                  <h4 className="font-semibold flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-500"/>Optimization Summary:</h4>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{optimizedSummary}</p>
                </div>
              )}
               <div className="mt-2 p-2 border rounded-md max-h-60 overflow-auto bg-white shadow">
                <Label>HTML Content Preview (first 500 chars):</Label>
                <pre className="text-xs whitespace-pre-wrap break-all">
                  {htmlContent.substring(0,500)}{htmlContent.length > 500 ? '...' : ''}
                </pre>
              </div>
            </CardContent>
          </Card>
        )}

        <Button type="submit" disabled={isSending || isOptimizing || !htmlContent} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
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

export default UploadHtmlForm;
