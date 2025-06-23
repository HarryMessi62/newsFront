import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Mail, User, Trash2, RefreshCw, Send } from 'lucide-react';
import { 
  getArticleComments, 
  addComment, 
  deleteUserComment, 
  toggleCommentLike,
  hasUserCommentedLocally,
  getUserCommentStats
} from '../utils/hybridCommentStorage';

interface CommentSectionProps {
  articleId: string;
  className?: string;
}

interface Comment {
  _id: string;
  text: string;
  userEmail: string;
  likes: number;
  createdAt: string;
  likedBy: Array<{ userId: string; timestamp: string }>;
}

const CommentSection: React.FC<CommentSectionProps> = ({ articleId, className = '' }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [commentEmail, setCommentEmail] = useState('');
  const [userHasCommented, setUserHasCommented] = useState(false);
  const [formErrors, setFormErrors] = useState<{email?: string, content?: string}>({});
  const [error, setError] = useState<string | null>(null);

  // Загружаем комментарии при монтировании компонента
  const loadComments = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await getArticleComments(articleId);
      
      if (result.error) {
        setError(result.error);
      } else {
        setComments(result.comments);
        setUserHasCommented(result.userHasCommented);
      }
    } catch (err: any) {
      console.error('Error loading comments:', err);
      setError('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComments();
  }, [articleId]);

  // Проверяем локально, комментировал ли пользователь эту статью
  useEffect(() => {
    const hasCommentedLocally = hasUserCommentedLocally(articleId);
    if (hasCommentedLocally && !userHasCommented) {
      setUserHasCommented(true);
    }
  }, [articleId, userHasCommented]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset errors
    setFormErrors({});
    
    // Validate form
    const errors: {email?: string, content?: string} = {};
    
    if (!commentEmail.trim()) {
      errors.email = 'Email is required';
    } else if (!validateEmail(commentEmail)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!newComment.trim()) {
      errors.content = 'Comment is required';
    } else if (newComment.trim().length < 10) {
      errors.content = 'Comment must be at least 10 characters long';
    } else if (newComment.trim().length > 1000) {
      errors.content = 'Comment cannot exceed 1000 characters';
    }
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    setSubmitting(true);
    
    try {
      const result = await addComment(articleId, commentEmail.trim(), newComment.trim());
      
      if (result.success) {
        // Перезагружаем комментарии
        await loadComments();
        
        // Очищаем форму
        setNewComment('');
        setCommentEmail('');
        setFormErrors({});
        
        console.log('Comment added successfully');
      } else {
        console.error('Failed to add comment:', result.error);
        setFormErrors({ 
          content: result.error || 'Failed to add comment. Please try again.' 
        });
      }
    } catch (error: any) {
      console.error('Error adding comment:', error);
      setFormErrors({ 
        content: 'Failed to add comment. Please try again.' 
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCommentLike = async (commentId: string) => {
    try {
      const result = await toggleCommentLike(commentId);
      
      if (result.error) {
        console.error('Error toggling comment like:', result.error);
        return;
      }
      
      // Обновляем состояние комментария
      setComments(prevComments => 
        prevComments.map(comment => 
          comment._id === commentId 
            ? { ...comment, likes: result.totalLikes }
            : comment
        )
      );
    } catch (error) {
      console.error('Error toggling comment like:', error);
    }
  };

  const handleDeleteComment = async () => {
    if (!confirm('Are you sure you want to delete your comment?')) {
      return;
    }
    
    try {
      const result = await deleteUserComment(articleId);
      
      if (result.success) {
        // Перезагружаем комментарии
        await loadComments();
        console.log('Comment deleted successfully');
      } else {
        console.error('Failed to delete comment:', result.error);
        alert('Failed to delete comment. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Failed to delete comment. Please try again.');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const maskEmail = (email: string) => {
    const [name, domain] = email.split('@');
    if (name.length <= 2) return email;
    return `${name.substring(0, 2)}***@${domain}`;
  };

  if (loading) {
    return (
      <div className={`${className}`}>
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="h-8 w-8 text-blue-500 animate-spin" />
          <span className="ml-3 text-white">Loading comments...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      {/* Comments Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <MessageCircle className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-white">
            Comments ({comments.length})
          </h3>
        </div>
        
        <button
          onClick={loadComments}
          className="flex items-center space-x-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Refresh</span>
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-900/50 border border-red-500 rounded-lg">
          <p className="text-red-300">Error: {error}</p>
        </div>
      )}

      {/* Comment Form */}
      <div className="mb-8">
        <div className="bg-slate-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-white font-semibold">Leave a Comment</h4>
            {userHasCommented && (
              <div className="flex items-center space-x-2">
                <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm">
                  ✓ You've commented
                </span>
                <button
                  onClick={handleDeleteComment}
                  className="flex items-center space-x-1 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-full text-sm transition-colors"
                >
                  <Trash2 className="h-3 w-3" />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>
          
          {!userHasCommented && (
            <form onSubmit={handleSubmitComment} className="space-y-4">
              <div>
                <input
                  type="email"
                  placeholder="Your email (will be masked in comments)"
                  value={commentEmail}
                  onChange={(e) => setCommentEmail(e.target.value)}
                  disabled={submitting}
                  className={`w-full px-4 py-3 bg-slate-700 text-white rounded-lg border ${
                    formErrors.email ? 'border-red-500' : 'border-slate-600'
                  } focus:border-blue-500 focus:outline-none transition-colors disabled:opacity-50`}
                />
                {formErrors.email && (
                  <p className="text-red-400 text-sm mt-1">{formErrors.email}</p>
                )}
              </div>
              
              <div>
                <textarea
                  placeholder="Write your comment here... (minimum 10 characters)"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  disabled={submitting}
                  rows={4}
                  className={`w-full px-4 py-3 bg-slate-700 text-white rounded-lg border ${
                    formErrors.content ? 'border-red-500' : 'border-slate-600'
                  } focus:border-blue-500 focus:outline-none transition-colors resize-none disabled:opacity-50 break-words`}
                />
                <div className="flex justify-between items-center mt-2">
                  <div>
                    {formErrors.content && (
                      <p className="text-red-400 text-sm">{formErrors.content}</p>
                    )}
                  </div>
                  <span className="text-slate-400 text-sm">
                    {newComment.length}/1000
                  </span>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={submitting || !newComment.trim() || !commentEmail.trim()}
                className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                {submitting ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                <span>{submitting ? 'Submitting...' : 'Submit Comment'}</span>
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-6">
        {comments.length === 0 ? (
          <div className="text-center py-8">
            <MessageCircle className="h-16 w-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 text-lg">No comments yet</p>
            <p className="text-slate-500">Be the first to share your thoughts!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="bg-slate-800 rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-slate-700 p-2 rounded-full">
                    <User className="h-4 w-4 text-slate-300" />
                  </div>
                  <div>
                    <p className="text-white font-medium">
                      {maskEmail(comment.userEmail)}
                    </p>
                    <p className="text-slate-400 text-sm">
                      {formatDate(comment.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-slate-200 leading-relaxed break-words overflow-wrap-anywhere">
                  {comment.text}
                </p>
              </div>
              
              <div className="flex items-center justify-between">
                <button
                  onClick={() => handleCommentLike(comment._id)}
                  className="flex items-center space-x-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                >
                  <Heart className="h-4 w-4" />
                  <span>{comment.likes}</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection; 