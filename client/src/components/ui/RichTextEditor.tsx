/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/ui/react-quill-editor.tsx
import React, { useRef, useState } from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import { UseFormReturn } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel } from "./form";
import { uploadToCloudinary } from "@/services/cloudinary/cloudinary";
import { MediaFile } from "@/types/lessonInterface";

interface ReactQuillEditorProps {
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
  form: UseFormReturn<any>;
}

import ImageResize from "quill-image-resize-module-react";
Quill.register("modules/imageResize", ImageResize);








const QuillEditor = React.forwardRef<ReactQuill, React.ComponentProps<typeof ReactQuill>>(
  (props, ref) => <ReactQuill ref={ref} {...props} />
);
QuillEditor.displayName = "QuillEditor";









const RichTextEditor: React.FC<ReactQuillEditorProps> = ({
  name,
  label,
  placeholder = "Write something...",
  required = false,
  className = "",
  form,
}) => {
  const [multimedia, setMultimedia] = useState<MediaFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const quillRef = useRef<ReactQuill>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageHandler = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (file) {
        await handleMediaUpload(file, "image", true);
      }
    };
  };

  function videoHandler() {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "video/*");
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (file) {
        await handleMediaUpload(file, "video", true);
      }
    };
  }

  const handleMediaUpload = async (
    file: File,
    type: "image" | "video",
    insertIntoEditor: boolean = false
  ) => {
    setUploading(true);
    try {
      const uploadResult = await uploadToCloudinary(file, type);

      const mediaFile: MediaFile = {
        id: Date.now().toString(),
        type,
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        originalName: file.name,
        size: file.size,
      };

      setMultimedia((prev) => [...prev, mediaFile]);

      if (insertIntoEditor && quillRef.current) {
        const quill = quillRef.current.getEditor();
        const range = quill.getSelection();
        if (range) {
          if (type === "image") {
            quill.insertEmbed(range.index, "image", uploadResult.secure_url);
          } else {
            quill.insertEmbed(range.index, "video", uploadResult.secure_url);
          }
        }
      }
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        const type = file.type.startsWith("image/") ? "image" : "video";
        handleMediaUpload(file, type);
      });
    }
  };

  const removeMedia = (id: string) => {
    setMultimedia((prev) => prev.filter((media) => media.id !== id));
  };

  const modules =useRef( {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ color: [] }, { background: [] }],
        [{ script: "sub" }, { script: "super" }],
        ["blockquote", "code-block"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ indent: "-1" }, { indent: "+1" }],
        [{ align: [] }],
        ["link", "image", "video"],
        ["clean"],
      ],
      handlers: {
        image: imageHandler,
        video: videoHandler,
      },
    },
    imageResize: {
      parchment: Quill.import("parchment"),
      modules: ["Resize", "DisplaySize", "Toolbar"],
    },
  });

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
    <>
      <div>
        <div>
          {/* <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Media Files
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50"
            >
              {uploading ? "Uploading..." : "Select Images/Videos"}
            </button>
            <p className="text-sm text-gray-500 mt-2">
              Select images and videos to upload to Cloudinary
            </p>
          </div> */}
          {multimedia.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Uploaded Media:
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {multimedia.map((media) => (
                  <div
                    key={media.id}
                    className="relative border rounded-lg p-2"
                  >
                    {media.type === "image" ? (
                      <img
                        src={media.url}
                        alt={media.originalName}
                        className="w-full h-24 object-cover rounded"
                      />
                    ) : (
                      <video
                        src={media.url}
                        className="w-full h-24 object-cover rounded"
                        controls={false}
                      />
                    )}
                    <button
                      type="button"
                      onClick={() => removeMedia(media.id)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-xs"
                    >
                      ×
                    </button>
                    <p className="text-xs text-gray-500 mt-1 truncate">
                      {media.originalName}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className={`space-y-2`}>
        <FormField
          name={name}
          control={form.control}
          render={({ field }) => (
            <FormItem>
              {label && (
                <FormLabel>
                  {label}{" "}
                  {required && <span className="text-destructive">*</span>}
                </FormLabel>
              )}
              <FormControl asChild>
              <ReactQuill
                ref={quillRef}
                theme="snow"
                modules={modules.current}
                formats={formats}
                placeholder={placeholder}
                value={field.value}
                onChange={field.onChange}
                className="bg-background"
                style={{
                  border: "none",
                  borderRadius: "0.375rem",
                }}
              />
              </FormControl>
            </FormItem>
          )}
        />

        {/* {form.errors[name] && (
        <p className="text-sm text-destructive">
          {form.errors[name]?.message as string}
        </p>
      )} */}
      </div>
    </>
  );
};

export default RichTextEditor;
