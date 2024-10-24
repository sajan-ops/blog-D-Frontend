"use client";
import React, {
    useState,
    useCallback,
    useEffect,
    useRef,
    useContext,
} from "react";
import dynamic from "next/dynamic";
import { EditorState, convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";
import { GlobalStateContext } from "../../layout";
import { getMediaUrlPath } from "@/lib/mediaUrl";
import { isMediaType } from "@/lib/checkMediaTypes";
import { apiUrl } from "@/lib/apiConfig";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";

// Dynamically import the Editor component with SSR disabled
const Editor = dynamic(
    () => import("react-draft-wysiwyg").then((mod) => mod.Editor),
    { ssr: false },
);

export default function CreatePost() {
    const [title, setTitle] = useState("");
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const [description, setDescription] = useState("");
    const [keywords, setKeywords] = useState("");
    const [author, setAuthor] = useState("");
    const [editorState, setEditorState] = useState<EditorState>(
        EditorState.createEmpty(),
    );
    const [mounted, setMounted] = useState(false);
    const [categories, setCategories] = useState<any>([]);
    const [category, setCategory] = useState<any>("");
    const [ReadTime, setReadTime] = useState(0);
    const [postType, setPostType] = useState("instant");
    const [scheduleDate, setScheduleDate] = useState("");
    const router = useRouter();
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
    let { globalState, setglobalState } = useContext<any>(GlobalStateContext);
    let pathName = usePathname();
    useEffect(() => {
        let isMounted = true;

        if (isMounted) {
            setMounted(true);
        }

        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        fetchCategories();
    }, []);
    const fetchCategories = async () => {
        let token = localStorage.getItem("adminToken");
        try {
            const { data } = await axios.get(`${apiUrl}/admin/post/fetchAllCategories`, {
                headers: {
                    Authorization: `Bearer ${token}`, // Add the token to the Authorization header
                },
            });
            setCategories(data.data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const openPreviewModal = () => {
        setShowPreviewModal(true);
    };

    // Handle media removal
    const handleRemoveMedia = (id: any) => {
        setglobalState({
            mediaItems: globalState.mediaItems.filter((val: any) => {
                return val.id !== id;
            }),
        });
    };

    const onEditorStateChange = useCallback(
        (newEditorState: any) => {
            if (mounted) {
                setEditorState(newEditorState);
            }
        },
        [mounted],
    );
    const submitPost = async (e: any) => {
        e.preventDefault();
        toast.loading("Post creating...");
        // Prevent default form submission behavior
        const contentState = editorState.getCurrentContent();
        if (!contentState.hasText()) {
            toast.dismiss();
            toast.error("Please Write Content!");
            // Proceed with form submission
            return;
        }
        const content = draftToHtml(convertToRaw(editorState.getCurrentContent()));
        const newPostData: any = {
            title,
            description,
            keywords,
            author,
            ReadTime,
            filePath: globalState.mediaItems.map((val: any) => val.filePath),
            fileIds: globalState.mediaItems.map((val: any) => val.id),
            content,
            category,
            postType,
            scheduleDate
        };
        try {
            let adminToken = localStorage.getItem("adminToken");
            // function to create a post
            let response = await fetch(`${apiUrl}/admin/post/create-post`, {
                method: "POST",
                body: JSON.stringify(newPostData),
                headers: {
                    Authorization: "Bearer " + adminToken,
                    "Content-Type": "application/json",
                },
            });
            const responseData = await response.json();
            if (responseData?.error?.includes("Duplicate entry")) {
                toast.dismiss();
                toast.error("Please use a unique Post title");
                return;
            }
            toast.dismiss();
            toast.success("Post Created");
            router.push("/dashboard/posts");
        } catch (error) {
            toast.dismiss();
            toast.error("Post failed to create");
            console.error("Error:", error);
        }
    };

    const gotoGallery = () => {
        localStorage.setItem("oldRoute", pathName)
        router.push("/dashboard/gallery")
    }

    return (
        <div className="mx-auto rounded-lg bg-gray-100 p-10 pt-25 shadow-lg">
            <Toaster />
            <h2 className="mb-10 text-center font-bold text-blue-500 underline underline-offset-4">
                Create a New Post
            </h2>
            <form
                onSubmit={submitPost}
                encType="multipart/form-data"
                className="mx-auto max-w-4xl space-y-8 p-6"
            >
                {/* File Upload */}
                <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-6">
                    <p className="text-lg font-medium text-gray-700">
                        Select Media/Images for Article.
                    </p>
                    <button
                        type="button"
                        onClick={() => gotoGallery()}
                        className="inline-block rounded-lg bg-blue-500 px-4 py-2 font-medium text-white transition hover:bg-blue-600"
                    >
                        Go to Gallery
                    </button>
                </div>
                {/* Display selected media */}
                {globalState && globalState.mediaItems.length > 0 ? (
                    <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                        {globalState.mediaItems.map((mediaUrl, index) => (
                            <div
                                key={index}
                                className="group relative overflow-hidden rounded-lg border-2"
                            >
                                {isMediaType.video(mediaUrl) ? (
                                    <video controls className="h-40 w-full object-cover">
                                        <source src={mediaUrl.filePath} type="video/mp4" />
                                    </video>
                                ) : (
                                    <img
                                        src={getMediaUrlPath(mediaUrl.filePath)}
                                        alt={`Selected media ${index + 1}`}
                                        className="h-40 w-full object-cover"
                                    />
                                )}
                                {/* Remove button */}
                                <button
                                    type="button"
                                    onClick={() => handleRemoveMedia(mediaUrl.id)}
                                    className="absolute right-2 top-2 rounded-full bg-black p-1.5 text-white opacity-60 transition hover:opacity-90"
                                >
                                    <svg
                                        viewBox="0 0 16 16"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4"
                                    >
                                        <path
                                            d="M12.57 4.3a.61.61 0 0 0 0-.87.61.61 0 0 0-.87 0L8 7.13 4.3 3.43a.61.61 0 0 0-.87 0 .61.61 0 0 0 0 .87L7.13 8l-3.7 3.7a.61.61 0 0 0 0 .87.61.61 0 0 0 .87 0L8 8.87l3.7 3.7a.61.61 0 0 0 .87 0 .61.61 0 0 0 0-.87L8.87 8l3.7-3.7z"
                                            fill="currentColor"
                                        />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="mt-5 text-center text-gray-500">
                        No media selected. Please select from the gallery.
                    </p>
                )}

                {/* Title */}
                <div className="grid grid-cols-1 gap-4">
                    <label
                        className="text-sm font-medium text-gray-700"
                        htmlFor="title"
                    >
                        Title
                    </label>
                    <input
                        id="title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter post title"
                        className={`w-full rounded-lg border p-3 shadow-sm transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${errors.title ? "border-red-500" : "border-gray-300"
                            }`}
                        required
                    />
                </div>

                {/* Description */}
                <div className="space-y-1">
                    <label
                        className="text-sm font-medium text-gray-700"
                        htmlFor="description"
                    >
                        Meta Description
                    </label>
                    <input
                        id="description"
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter post description"
                        className={`w-full rounded-lg border p-3 shadow-sm transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${errors.description ? "border-red-500" : "border-gray-300"
                            }`}
                        required
                    />
                </div>

                {/* Keywords */}
                <div className="space-y-1">
                    <label
                        className="text-sm font-medium text-gray-700"
                        htmlFor="keywords"
                    >
                        Focus Keywords
                    </label>
                    <input
                        id="keywords"
                        type="text"
                        value={keywords}
                        onChange={(e) => setKeywords(e.target.value)}
                        placeholder="Enter post keywords"
                        className="w-full rounded-lg border border-gray-300 p-3 shadow-sm transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        required
                    />
                </div>
                {/* Category Select Box */}
                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700" htmlFor="category">
                        Category
                    </label>
                    <select
                        id="category"
                        value={category} // Make sure to have a state variable named `category`
                        onChange={(e) => setCategory(e.target.value)} // Use setCategory to update state
                        className="w-full rounded-lg border border-gray-300 p-3 shadow-sm transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        required
                    >
                        <option value="">Select a category</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.name}> {/* Use a unique key */}
                                {cat.name} {/* Assuming the category object has a `name` property */}
                            </option>
                        ))}
                    </select>
                </div>
                {/* Author */}
                <div className="space-y-1">
                    <label
                        className="text-sm font-medium text-gray-700"
                        htmlFor="author"
                    >
                        Author
                    </label>
                    <input
                        id="author"
                        type="text"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        placeholder="Enter author's name"
                        className="w-full rounded-lg border border-gray-300 p-3 shadow-sm transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        required
                    />
                </div>

                {/* Read Time */}
                <div className="space-y-1">
                    <label
                        className="text-sm font-medium text-gray-700"
                        htmlFor="time"
                    >
                        Estimated Read Time (In Mins)
                    </label>
                    <input
                        id="time"
                        type="number"
                        value={ReadTime}
                        onChange={(e: any) => setReadTime(e.target.value)}
                        placeholder="Enter Estimated Read Time"
                        className="w-full rounded-lg border border-gray-300 p-3 shadow-sm transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        required
                    />
                </div>


                {/* Content Editor */}
                {mounted && (
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">
                            Content
                        </label>
                        <Editor
                            editorState={editorState}
                            onEditorStateChange={onEditorStateChange}
                            wrapperClassName="wrapper-class"
                            editorClassName="editor-class"
                            toolbarClassName="toolbar-class"
                            editorStyle={{
                                height: 300,
                                border: "1px solid #e5e7eb",
                                borderRadius: "0.5rem",
                                padding: "0.75rem",
                            }}
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
                                },
                            }}
                        />
                    </div>
                )}

                {/* Post Type Selection */}
                <div className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">
                            Post Type
                        </label>
                        <select
                            value={postType}
                            onChange={(e) => setPostType(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 bg-white p-3 shadow-sm transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        >
                            <option value="instant">Instant Post</option>
                            <option value="draft">Save as Draft</option>
                            <option value="schedule">Schedule Post</option>
                        </select>
                    </div>

                    {postType === "schedule" && (
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">
                                Schedule Date and Time
                            </label>
                            <input
                                type="datetime-local"
                                value={scheduleDate}
                                onChange={(e) => setScheduleDate(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 p-3 shadow-sm transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                min={new Date().toISOString().slice(0, 16)}
                                required
                            />
                        </div>
                    )}
                </div>
                <button
                    type="button"
                    onClick={openPreviewModal}
                    className="flex w-full items-center justify-center space-x-2 rounded-lg bg-green-500 px-6 py-3 font-medium text-white transition duration-200 hover:bg-green-600"
                >
                    <span>Preview</span>
                </button>
                {/* Submit Button */}
                <button
                    type="submit"
                    className="flex w-full items-center justify-center space-x-2 rounded-lg bg-blue-500 px-6 py-3 font-medium text-white transition duration-200 hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="h-5 w-5"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                        />
                    </svg>
                    <span>
                        {postType === "draft"
                            ? "Save as Draft"
                            : postType === "schedule"
                                ? "Schedule Post"
                                : "Publish Now"}
                    </span>
                </button>
            </form>
            {showPreviewModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg p-6 max-w-lg w-full shadow-lg">
                        <h2 className="text-xl font-bold mb-2">{title}</h2>
                        <p className="text-gray-700 mb-4">{description}</p>
                        <div
                            className="content-preview mb-4"
                            dangerouslySetInnerHTML={{ __html: draftToHtml(convertToRaw(editorState.getCurrentContent())) }}
                        />

                        {/* SERP View with Google-like label */}
                        <div className="mt-4 p-4 border border-gray-200 rounded-lg">
                            <div className="text-xs text-blue-600 font-bold mb-1">Google</div>
                            <a href="#" className="text-blue-500 hover:underline text-sm">www.yourdomain.com</a>
                            <div className="text-lg font-bold">{title}</div>
                            <p className="text-gray-600">{description}</p>
                        </div>

                        <button
                            onClick={() => setShowPreviewModal(false)}
                            className="mt-4 rounded-lg px-4 py-2 text-black cursor-pointer"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6 w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>

                        </button>
                    </div>
                </div>
            )}


        </div>
    );
}
