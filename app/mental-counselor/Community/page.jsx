
"use client";

import { useState, useEffect } from "react";
import { Users, MessageSquare, Plus, Heart, MessageCircle, Clock, User, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";

export default function CommunityPage() {
  const [posts, setPosts] = useState([]);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPost, setNewPost] = useState({ title: "", content: "", category: "general" });
  const [expandedPosts, setExpandedPosts] = useState(new Set());

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = () => {
    // Load from localStorage
    const storedPosts = localStorage.getItem('mindbridge_community_posts');
    if (storedPosts) {
      setPosts(JSON.parse(storedPosts));
    } else {
      // Sample posts
      const samplePosts = [
        {
          id: "1",
          title: "Managing period pain naturally - what works for you?",
          content: "I've been trying different natural remedies for period cramps. Heat pads work well, but I'm curious about other methods. What has helped you the most?",
          author: "Sarah M.",
          category: "period-health",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          likes: 12,
          replies: [
            {
              id: "r1",
              content: "Yoga and gentle stretching really help me! I do child's pose and cat-cow stretches.",
              author: "Emily K.",
              timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
              likes: 5
            },
            {
              id: "r2", 
              content: "Magnesium supplements have been a game changer for me. Started taking them a week before my period.",
              author: "Lisa R.",
              timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
              likes: 3
            }
          ]
        },
        {
          id: "2",
          title: "Tracking mood changes during cycle - any tips?",
          content: "I notice my mood fluctuates a lot during my cycle. How do you track and manage these changes?",
          author: "Anna J.",
          category: "mental-health",
          timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
          likes: 8,
          replies: []
        }
      ];
      localStorage.setItem('mindbridge_community_posts', JSON.stringify(samplePosts));
      setPosts(samplePosts);
    }
  };

  const createPost = () => {
    if (!newPost.title.trim() || !newPost.content.trim()) return;

    const post = {
      id: Date.now().toString(),
      title: newPost.title,
      content: newPost.content,
      category: newPost.category,
      author: "You",
      timestamp: new Date().toISOString(),
      likes: 0,
      replies: []
    };

    const updatedPosts = [post, ...posts];
    setPosts(updatedPosts);
    localStorage.setItem('mindbridge_community_posts', JSON.stringify(updatedPosts));
    
    setNewPost({ title: "", content: "", category: "general" });
    setShowCreatePost(false);
  };

  const addReply = (postId, replyContent) => {
    if (!replyContent.trim()) return;

    const reply = {
      id: Date.now().toString(),
      content: replyContent,
      author: "You",
      timestamp: new Date().toISOString(),
      likes: 0
    };

    const updatedPosts = posts.map(post => 
      post.id === postId 
        ? { ...post, replies: [...post.replies, reply] }
        : post
    );

    setPosts(updatedPosts);
    localStorage.setItem('mindbridge_community_posts', JSON.stringify(updatedPosts));
  };

  const toggleExpanded = (postId) => {
    const newExpanded = new Set(expandedPosts);
    if (newExpanded.has(postId)) {
      newExpanded.delete(postId);
    } else {
      newExpanded.add(postId);
    }
    setExpandedPosts(newExpanded);
  };

  const getCategoryColor = (category) => {
    const colors = {
      'period-health': 'bg-pink-100 text-pink-800',
      'mental-health': 'bg-purple-100 text-purple-800',
      'nutrition': 'bg-green-100 text-green-800',
      'general': 'bg-blue-100 text-blue-800'
    };
    return colors[category] || colors.general;
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <main className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <Users className="w-6 h-6 text-purple-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Community</h1>
        </div>
        <p className="text-gray-600">Share experiences and support each other on your wellness journey</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{posts.length}</p>
              <p className="text-sm text-gray-600">Total Posts</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">150+</p>
              <p className="text-sm text-gray-600">Active Members</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <Heart className="w-8 h-8 text-pink-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">500+</p>
              <p className="text-sm text-gray-600">Helpful Responses</p>
            </div>
          </div>
        </div>
      </div>

      {/* Create Post Button */}
      {!showCreatePost && (
        <button
          onClick={() => setShowCreatePost(true)}
          className="w-full mb-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 rounded-lg flex items-center justify-center gap-2 hover:shadow-lg transition-all duration-200"
        >
          <Plus className="w-5 h-5" />
          Share Your Experience
        </button>
      )}

      {/* Create Post Form */}
      {showCreatePost && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Create New Post</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={newPost.category}
                onChange={(e) => setNewPost({...newPost, category: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                <option value="general">General Discussion</option>
                <option value="period-health">Period Health</option>
                <option value="mental-health">Mental Health</option>
                <option value="nutrition">Nutrition & Diet</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                value={newPost.title}
                onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                placeholder="What would you like to discuss?"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
              <textarea
                value={newPost.content}
                onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                placeholder="Share your thoughts, experiences, or questions..."
                rows="4"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={createPost}
                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Post
              </button>
              <button
                onClick={() => setShowCreatePost(false)}
                className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Posts List */}
      <div className="space-y-6">
        {posts.map((post) => (
          <PostCard 
            key={post.id} 
            post={post} 
            isExpanded={expandedPosts.has(post.id)}
            onToggleExpanded={() => toggleExpanded(post.id)}
            onAddReply={addReply}
            getCategoryColor={getCategoryColor}
            formatTimeAgo={formatTimeAgo}
          />
        ))}
      </div>

      {posts.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
          <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No posts yet</h3>
          <p className="text-gray-500 mb-6">Be the first to start a discussion in the community!</p>
          <button
            onClick={() => setShowCreatePost(true)}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Create First Post
          </button>
        </div>
      )}
    </main>
  );
}

// Post Card Component
function PostCard({ post, isExpanded, onToggleExpanded, onAddReply, getCategoryColor, formatTimeAgo }) {
  const [replyText, setReplyText] = useState("");
  const [showReplyForm, setShowReplyForm] = useState(false);

  const handleReply = () => {
    if (replyText.trim()) {
      onAddReply(post.id, replyText);
      setReplyText("");
      setShowReplyForm(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Post Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-gray-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900">{post.author}</p>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              {formatTimeAgo(post.timestamp)}
            </div>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(post.category)}`}>
          {post.category.replace('-', ' ')}
        </span>
      </div>

      {/* Post Content */}
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{post.title}</h3>
      <p className="text-gray-700 mb-4">{post.content}</p>

      {/* Post Actions */}
      <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
        <button className="flex items-center gap-2 text-gray-600 hover:text-pink-600 transition-colors">
          <Heart className="w-4 h-4" />
          <span>{post.likes}</span>
        </button>
        
        <button 
          onClick={onToggleExpanded}
          className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          <span>{post.replies.length} replies</span>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        
        <button 
          onClick={() => setShowReplyForm(!showReplyForm)}
          className="text-purple-600 hover:text-purple-700 transition-colors"
        >
          Reply
        </button>
      </div>

      {/* Reply Form */}
      {showReplyForm && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Share your thoughts..."
            rows="3"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 mb-3"
          />
          <div className="flex gap-2">
            <button
              onClick={handleReply}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Reply
            </button>
            <button
              onClick={() => setShowReplyForm(false)}
              className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Replies */}
      {isExpanded && post.replies.length > 0 && (
        <div className="mt-4 space-y-3">
          {post.replies.map((reply) => (
            <div key={reply.id} className="pl-4 border-l-2 border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="w-3 h-3 text-gray-600" />
                </div>
                <span className="font-medium text-sm text-gray-900">{reply.author}</span>
                <span className="text-xs text-gray-500">{formatTimeAgo(reply.timestamp)}</span>
              </div>
              <p className="text-gray-700 text-sm mb-2">{reply.content}</p>
              <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-pink-600 transition-colors">
                <Heart className="w-3 h-3" />
                <span>{reply.likes}</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
