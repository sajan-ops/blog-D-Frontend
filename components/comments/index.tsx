"use client"
import { useEffect, useState } from 'react';
import { MessageCircle, MessageSquare, Send } from 'lucide-react';
import axios from 'axios';
import { apiUrl } from '@/lib/apiConfig';
import toast, { Toaster } from 'react-hot-toast';

const CommentsSection = ({ slug }) => {
    const [comments, setComments] = useState<any>([]);
    const [newComment, setNewComment] = useState<any>('');

    const handleCommentChange = (e) => {
        setNewComment(e.target.value);
    };
    useEffect(() => {
        fetchCommentsOfblog()
    }, [])


    const fetchCommentsOfblog = async () => {
        try {
            const { data } = await axios.get(`${apiUrl}/user/post/getComments/${slug}`);
            // Optionally, you can handle the response if needed
            console.log('Comment Response:', data);
            if (data.success) {
                setComments(data.commentsWithUsers)
            }

        } catch (error) {
            console.error('Error submitting comment:', error);
        }

    };


    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('userToken');
        if (!token) {
            toast.error("Please login!")
            return;
        }
        if (newComment.trim()) {
            try {
                // Get token from localStorage
                const token = localStorage.getItem('userToken'); // Replace with your actual token key
                const { data } = await axios.post(`${apiUrl}/user/post/postComment/${slug}`, { newComment }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
                    },
                });
                if (data.success) {
                    setComments("");
                    setNewComment('');
                    await fetchCommentsOfblog()
                }

            } catch (error) {
                console.error('Error submitting comment:', error);
            }
        }
    };


    //   check if a user is logged in
    const isUserLoggedIn = () => {
        return localStorage.getItem('userToken') !== null;
    };
    const userLoggedIn = isUserLoggedIn();
    return (
        <div className="mx-auto p-20">
            <Toaster position="top-center" reverseOrder={false} containerStyle={{ zIndex: 999990 }} />
            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center space-x-3 border-b pb-4">
                    <MessageCircle className="w-6 h-6 text-blue-500" />
                    <h2 className="text-2xl font-semibold text-gray-800">Comments</h2>
                    {comments.length > 0 && (
                        <span className="bg-blue-100 text-blue-600 text-sm px-3 py-1 rounded-full">
                            {comments.length}
                        </span>
                    )}
                </div>

                {/* Comments List */}
                <div className="w-full max-w-3xl mx-auto px-4">
                    <div className="space-y-4 max-h-[32rem] overflow-y-auto pr-2">
                        {comments.length > 0 ? (
                            comments.map((comment) => (
                                <div
                                    key={comment.id}
                                    className="group bg-white border border-gray-200 rounded-lg p-5 transition-all duration-200 hover:shadow-md hover:border-gray-300"
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                                        <div className="flex-shrink-0">
                                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                                                <span className="text-gray-600 font-medium">
                                                    {comment.username.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                                <h3 className="text-sm font-semibold text-gray-900">
                                                    {comment.username}
                                                </h3>
                                                <span className="text-xs text-gray-500">
                                                    {new Date(comment.date).toLocaleString()}
                                                </span>
                                            </div>
                                            <div className="mt-4">
                                                {comment.approve === 1 ? ( // Show comment only if approved
                                                    <p className="mt-2 text-gray-700 leading-relaxed break-words">
                                                        {comment.comment}
                                                    </p>
                                                ) : userLoggedIn ? ( // If unapproved and user is logged in
                                                    <div>
                                                        <p className="mt-2 text-gray-700 leading-relaxed break-words">
                                                            {comment.comment}
                                                        </p>
                                                        <div className="mt-2 p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
                                                            <p className="font-semibold">Your comment needs approval.</p>
                                                        </div>
                                                    </div>
                                                ) : null} {/* Do not show anything if unapproved and user is not logged in */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12 bg-gray-50 rounded-lg">
                                <MessageSquare className="mx-auto h-8 w-8 text-gray-400 mb-3" />
                                <p className="text-gray-500 font-medium">No comments yet</p>
                                <p className="text-sm text-gray-400 mt-1">
                                    Be the first to share your thoughts!
                                </p>
                            </div>
                        )}
                    </div>
                </div>
                {/* Comment Form */}
                <form onSubmit={handleCommentSubmit} className="space-y-4">
                    <div className="relative">
                        <textarea
                            value={newComment}
                            onChange={handleCommentChange}
                            placeholder="Share your thoughts..."
                            required
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none h-32 transition-all duration-200 placeholder:text-gray-400"
                        />
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            <span>Post Comment</span>
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </form>

            </div>
        </div>
    );
};

export default CommentsSection;