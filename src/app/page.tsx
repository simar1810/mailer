'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ComposeEmailForm from "@/components/compose-email-form";
import UploadHtmlForm from "@/components/upload-html-form";
import { Edit3, UploadCloud } from "lucide-react";

export default function MailSenderPage() {
  return (
    <div className="container mx-auto px-4 py-8 flex justify-center items-start min-h-[calc(100vh-100px)]">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-primary">Create & Send Email</CardTitle>
          <CardDescription className="text-md">
            Choose your preferred method to craft and send your email.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="compose" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="compose" className="py-3 text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Edit3 className="mr-2 h-5 w-5" /> Compose with AI
              </TabsTrigger>
              <TabsTrigger value="upload" className="py-3 text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <UploadCloud className="mr-2 h-5 w-5" /> Upload HTML
              </TabsTrigger>
            </TabsList>
            <TabsContent value="compose">
              <ComposeEmailForm />
            </TabsContent>
            <TabsContent value="upload">
              <UploadHtmlForm />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
