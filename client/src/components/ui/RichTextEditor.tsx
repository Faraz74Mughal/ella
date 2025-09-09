/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/ui/react-quill-editor.tsx
import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {  UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel } from "./form";

interface ReactQuillEditorProps {
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
  form:UseFormReturn<any>
}

const RichTextEditor: React.FC<ReactQuillEditorProps> = ({
  name,
  label,
  placeholder = "Write something...",
  required = false,
  className = "",
  form
}) => {
 

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ font: [] }],
      [{ size: ["small", false, "large", "huge"] }],
      ["bold", "italic", "underline", "strike"],
     
      [{ script: "sub" }, { script: "super" }],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ align: [] }],
      ["blockquote", "code-block"],
      ["link", "image", "video"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "script",
    "list",
    "bullet",
    "indent",
    "align",
    "blockquote",
    "code-block",
    "link",
    "image",
    "video",
  ];

  return (
    <div className={`space-y-${className}`}>
 

      <FormField
        name={name}
        control={form.control}
        render={({ field }) => (
          <FormItem>
           {label&& <FormLabel>{label}  {required && <span className="text-destructive">*</span>}</FormLabel>}
            <ReactQuill
              {...field}
              theme="snow"
              modules={modules}
              formats={formats}
              placeholder={placeholder}
              onChange={(content) => field.onChange(content)}
              className="bg-background"
              style={{
                border: "none",
                borderRadius: "0.375rem",
              }}
            />
          </FormItem>
        )}
      />

      {/* {form.errors[name] && (
        <p className="text-sm text-destructive">
          {form.errors[name]?.message as string}
        </p>
      )} */}
    </div>
  );
};

export default RichTextEditor;
