import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = typeof window === 'object' ? require('react-quill') : () => false;
import 'react-quill/dist/quill.snow.css';

// Define form schema with Zod
const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  content: z.string().min(10, {
    message: "Content must be at least 10 characters.",
  }),
  excerpt: z.string().optional(),
});

export default function ReactQuillForm() {
  const [value, setValue] = useState('');
  const [previewContent, setPreviewContent] = useState('');
  
  // Define form
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      excerpt: ""
    },
  });

  // Handle form submission
  function onSubmit(values) {
    console.log(values);
    // In a real application, you would process the form data here
    alert('Form submitted successfully! Check console for data.');
  }

  // Update preview when content changes
  const handleContentChange = (content) => {
    setValue(content);
    form.setValue('content', content);
    setPreviewContent(content);
  };

  // React Quill modules configuration
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'font': [] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'align': [] }],
      ['link', 'image'],
      ['clean']
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-t-lg">
            <CardTitle className="text-2xl md:text-3xl">Rich Text Editor with React Quill</CardTitle>
            <CardDescription className="text-blue-100">
              Integrated with shadcn components and React Hook Form
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter a title" {...field} />
                      </FormControl>
                      <FormDescription>
                        This is your public display title.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content</FormLabel>
                      <FormControl>
                        <div className="rounded-md border overflow-hidden">
                          {ReactQuill && (
                            <ReactQuill
                              theme="snow"
                              value={value}
                              onChange={handleContentChange}
                              modules={modules}
                              className="h-64 mb-12"
                            />
                          )}
                        </div>
                      </FormControl>
                      <FormDescription>
                        Write your content with our rich text editor.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="excerpt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Excerpt (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Short summary" {...field} />
                      </FormControl>
                      <FormDescription>
                        A brief summary of your content.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-between">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => form.reset()}
                  >
                    Reset
                  </Button>
                  <Button type="submit">Submit</Button>
                </div>
              </form>
            </Form>

            <div className="mt-8">
              <Tabs defaultValue="preview" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="preview">Content Preview</TabsTrigger>
                  <TabsTrigger value="data">Form Data</TabsTrigger>
                </TabsList>
                <TabsContent value="preview">
                  <Card>
                    <CardHeader>
                      <CardTitle>Content Preview</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {previewContent ? (
                        <div 
                          className="prose max-w-none p-4 border rounded-md"
                          dangerouslySetInnerHTML={{ __html: previewContent }} 
                        />
                      ) : (
                        <p className="text-gray-500">Start typing to see a preview...</p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="data">
                  <Card>
                    <CardHeader>
                      <CardTitle>Form Data</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <pre className="bg-gray-100 p-4 rounded-md overflow-auto">
                        {JSON.stringify(form.watch(), null, 2)}
                      </pre>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-sm text-gray-600">
          <p>This example integrates React Quill with shadcn components and React Hook Form with Zod validation.</p>
        </div>
      </div>
    </div>
  );
}