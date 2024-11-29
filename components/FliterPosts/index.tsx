import React, { useState } from 'react';

// Sample data for posts
const initialPosts = [
    { id: 1, title: 'Post 1', category: 'Tech', status: 'Published', author: 'Alice', date: '2024-10-01' },
    { id: 2, title: 'Post 2', category: 'Health', status: 'Draft', author: 'Bob', date: '2024-10-05' },
    { id: 3, title: 'Post 3', category: 'Tech', status: 'Published', author: 'Alice', date: '2024-10-10' },
    // Add more posts as needed
];

const PostFilter = () => {
    const [category, setCategory] = useState('');
    const [status, setStatus] = useState('');
    const [author, setAuthor] = useState('');
    const [date, setDate] = useState('');

    const filteredPosts = initialPosts.filter(post => {
        return (
            (!category || post.category === category) &&
            (!status || post.status === status) &&
            (!author || post.author === author) &&
            (!date || post.date === date)
        );
    });

    return (
        <div>
            <h1>Post Filter</h1>
            <div className="filters">
                <select onChange={(e) => setCategory(e.target.value)} value={category}>
                    <option value="">All Categories</option>
                    <option value="Tech">Tech</option>
                    <option value="Health">Health</option>
                    {/* Add more categories as needed */}
                </select>

                <select onChange={(e) => setStatus(e.target.value)} value={status}>
                    <option value="">All Status</option>
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
                    {/* Add more statuses as needed */}
                </select>

                <select onChange={(e) => setAuthor(e.target.value)} value={author}>
                    <option value="">All Authors</option>
                    <option value="Alice">Alice</option>
                    <option value="Bob">Bob</option>
                    {/* Add more authors as needed */}
                </select>

                <input
                    type="date"
                    onChange={(e) => setDate(e.target.value)}
                    value={date}
                />
            </div>

            <ul>
                {filteredPosts.map(post => (
                    <li key={post.id}>{post.title} - {post.category} - {post.status} - {post.author} - {post.date}</li>
                ))}
            </ul>
        </div>
    );
};

export default PostFilter;
