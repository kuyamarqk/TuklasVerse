// src/components/CommentsSection.tsx
'use client'; // This component will likely need client-side interactivity (e.g., submitting comments)

import React, { useState } from 'react';
import Image from 'next/image';

interface Comment {
  id: string;
  userId: string;
  userName: string;
  avatarUrl?: string;
  timestamp: string;
  content: string;
}

interface CommentsSectionProps {
  contentId: number; // The ID of the content these comments belong to
  initialComments: Comment[];
  isLoggedIn: boolean;
  currentUserName: string;
  currentUserAvatarUrl?: string;
}

const CommentsSection: React.FC<CommentsSectionProps> = ({
  contentId,
  initialComments,
  isLoggedIn,
  currentUserName,
  currentUserAvatarUrl,
}) => {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newCommentText, setNewCommentText] = useState('');

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn || !newCommentText.trim()) {
      alert('Please log in and enter a comment.');
      return;
    }

    const newComment: Comment = {
      id: `c-${Date.now()}`, // Simple unique ID
      userId: 'mock-user-id', // Replace with actual user ID
      userName: currentUserName,
      avatarUrl: currentUserAvatarUrl,
      timestamp: new Date().toISOString(),
      content: newCommentText.trim(),
    };

    setComments((prevComments) => [newComment, ...prevComments]); // Add new comment to the top
    setNewCommentText('');

    // In a real app, you would send this comment to your backend API here
    console.log('New comment submitted:', newComment);
  };

  return (
    <div className="bg-[#3E2723] p-6 rounded-lg shadow-md mb-8">
      <h3 className="text-xl font-semibold mb-4">Comments ({comments.length})</h3>

      {/* Comment Input Section */}
      {isLoggedIn ? (
        <form onSubmit={handleAddComment} className="mb-6">
          <div className="flex items-start space-x-3 mb-4">
            <div className="flex-shrink-0">
              <Image
                src={currentUserAvatarUrl || '/placeholders/default-avatar.jpg'}
                alt={currentUserName}
                width={40}
                height={40}
                className="rounded-full object-cover"
              />
            </div>
            <textarea
              className="flex-grow w-full p-3 rounded-md bg-[#212121] text-[#FBE9E7] border border-[#52403A] focus:outline-none focus:border-[#2196F3]"
              rows={3}
              placeholder="Add a comment..."
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
            ></textarea>
          </div>
          <div className="text-right">
            <button
              type="submit"
              className="px-6 py-2 bg-[#2196F3] text-[#FBE9E7] rounded-md hover:bg-[#1A7BC2] transition-colors duration-200"
            >
              Post Comment
            </button>
          </div>
        </form>
      ) : (
        <p className="text-gray-400 text-center mb-6">Log in to post a comment.</p>
      )}

      {/* List of Comments */}
      <div className="space-y-6">
        {comments.length === 0 ? (
          <p className="text-gray-400 text-center">No comments yet. Be the first!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <Image
                  src={comment.avatarUrl || '/placeholders/default-avatar.jpg'}
                  alt={comment.userName}
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                />
              </div>
              <div className="flex-grow">
                <p className="font-semibold text-[#FBE9E7]">{comment.userName}</p>
                <p className="text-xs text-gray-500 mb-2">
                  {new Date(comment.timestamp).toLocaleString()}
                </p>
                <p className="text-gray-200 leading-relaxed">{comment.content}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentsSection;