"use client";
import React, { useState, useCallback, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { EditorState, convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import toast, { Toaster } from "react-hot-toast";
// Dynamically import the Editor component with SSR disabled
const Editor = dynamic(
    () => import("react-draft-wysiwyg").then((mod) => mod.Editor),
    { ssr: false }
);

export default function CreatePost() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [keywords, setKeywords] = useState("");
    const [author, setAuthor] = useState("");
    const [canonicalUrl, setCanonicalUrl] = useState("");
    const [metaRobots, setMetaRobots] = useState("index, follow"); // Default value
    const [ogTitle, setOgTitle] = useState("");
    const [ogDescription, setOgDescription] = useState("");
    const [ogImage, setOgImage] = useState("");
    const [twitterTitle, setTwitterTitle] = useState("");
    const [twitterDescription, setTwitterDescription] = useState("");
    const [twitterImage, setTwitterImage] = useState("");
    const [structuredData, setStructuredData] = useState("");
    const [editorState, setEditorState] = useState<EditorState>(EditorState.createEmpty());
    const [mounted, setMounted] = useState(false);
    const [file, setFile] = useState<any>(null);

    const [errors, setErrors] = useState({
        title: "",
        description: "",
        canonicalUrl: "",
        ogTitle: "",
        ogDescription: "",
        twitterTitle: "",
        twitterDescription: "",
        structuredData: "",
    });

    useEffect(() => {
        let isMounted = true;

        if (isMounted) {
            setMounted(true);
        }

        return () => {
            isMounted = false;
        };
    }, []);
    const imageMap = useRef(new Map());
    const validateFields = () => {
        const newErrors = {
            title: title ? "" : "Title is required.",
            description: description ? "" : "Description is required.",
            canonicalUrl: canonicalUrl ? "" : "Canonical URL is required.",
            ogTitle: ogTitle ? "" : "Open Graph title is required.",
            ogDescription: ogDescription ? "" : "Open Graph description is required.",
            twitterTitle: twitterTitle ? "" : "Twitter card title is required.",
            twitterDescription: twitterDescription
                ? ""
                : "Twitter card description is required.",
            structuredData: structuredData ? "" : "Structured data is required.",
        };

        setErrors(newErrors);

        return Object.values(newErrors).every((error) => error === "");
    };

    const onEditorStateChange = useCallback(
        (newEditorState: any) => {
            if (mounted) {
                setEditorState(newEditorState);
            }
        },
        [mounted]
    );

    const uploadCallback = (file: any) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e: any) => {
                const localUrl = e.target.result;
                const uniqueId = Date.now().toString();
                imageMap.current.set(uniqueId, { file, localUrl });
                resolve({ data: { link: localUrl, id: uniqueId } });
            };
            reader.readAsDataURL(file);
        });
    };

    const submitPost = async (e: any) => {
        toast.loading("Post creating...");
        e.preventDefault(); // Prevent default form submission behavior

        if (!validateFields()) {
            return;
        }
        const content = draftToHtml(convertToRaw(editorState.getCurrentContent()));

        const newPostData = {
            title,
            description,
            // file,
            keywords,
            author,
            canonicalUrl,
            metaRobots,
            ogTitle,
            ogDescription,
            ogImage,
            twitterTitle,
            twitterDescription,
            twitterImage,
            structuredData,
            content,
        };

        try {
            const formData = new FormData();
            // Append article title and content
            Object.entries(newPostData).forEach(([key, value]) => {
                formData.append(
                    key,
                    typeof value === "object" ? JSON.stringify(value) : value
                );
            });
            formData.append("file", file);
            // function to create a post
            let response = await fetch("api/createpost", {
                method: "POST",
                body: formData,
            });
            console.log("New post created response:", response);
            toast.dismiss();
            toast.success("Post Created");
        } catch (error) {
            toast.error("Post failed to create");
            console.error("Error:", error);
        }
    };

    return (
        <div className="p-10 mx-auto bg-gray-100 rounded-lg shadow-lg pt-25">
            <Toaster />
            <h2 className="font-bold mb-10 text-blue-500 text-center underline underline-offset-4">
                Create a New Post
            </h2>
            <form
                onSubmit={submitPost}
                encType="multipart/form-data"
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
                {/* Title */}
                <div>
                    <label className="block text-gray-700 font-medium mb-1" htmlFor="title">
                        Title
                    </label>
                    <input
                        id="title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter post title"
                        className={`w-full p-2 border ${errors.title ? "border-red-500" : "border-gray-300"} rounded-lg`}
                    />
                    {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
                </div>

                {/* Description */}
                <div>
                    <label className="block text-gray-700 font-medium mb-1" htmlFor="description">
                        Meta Description
                    </label>
                    <input
                        id="description"
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter post description"
                        className={`w-full p-2 border ${errors.description ? "border-red-500" : "border-gray-300"} rounded-lg`}
                    />
                    {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
                </div>

                {/* File Upload */}
                <div>
                    <label className="block text-gray-700 font-medium mb-1" htmlFor="file">
                        Choose media from gallery
                    </label>
                    <input
                        id="file"
                        type="file"
                        name="file"
                        onChange={(e: any) => setFile(e.target.files[0])}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                </div>

                {/* Keywords */}
                <div>
                    <label className="block text-gray-700 font-medium mb-1" htmlFor="keywords">
                        Focus Keywords
                    </label>
                    <input
                        id="keywords"
                        type="text"
                        value={keywords}
                        onChange={(e) => setKeywords(e.target.value)}
                        placeholder="Enter post keywords"
                        className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                </div>

                {/* Author */}
                <div>
                    <label className="block text-gray-700 font-medium mb-1" htmlFor="author">
                        Author
                    </label>
                    <input
                        id="author"
                        type="text"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        placeholder="Enter author's name"
                        className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                </div>
                {/* Content Editor */}
                {mounted && (
                    <div className="md:col-span-2">
                        <label className="block text-gray-700 font-medium mb-1">Content</label>
                        <Editor
                            editorState={editorState}
                            onEditorStateChange={onEditorStateChange}
                            wrapperClassName="wrapper-class"
                            editorClassName="editor-class border border-gray-300 rounded-lg"
                            toolbarClassName="toolbar-class"
                            editorStyle={{ height: 300 }}
                            toolbar={{
                                options: [
                                    "inline",
                                    "blockType",
                                    "fontSize",
                                    "list",
                                    "textAlign",
                                    "colorPicker",
                                    "link",
                                    "embedded",
                                    "emoji",
                                    "image",
                                    "remove",
                                    "history",
                                ],
                                inline: {
                                    inDropdown: false,
                                    options: ["bold", "italic", "underline", "strikethrough"],
                                    bold: { className: "bg-blue-500" },
                                    italic: { className: "bg-blue-500" },
                                    underline: { className: "bg-blue-500" },
                                    strikethrough: { className: "bg-blue-500" },
                                },
                            }}
                        />
                    </div>
                )}

                {/* Submit Button */}
                <div className="md:col-span-2">
                    <button
                        type="submit"
                        className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
                    >
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
}
