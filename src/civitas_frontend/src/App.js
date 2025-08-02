import React, { useState, useEffect } from "react";
import { Actor, HttpAgent } from "@dfinity/agent";
import { AuthClient } from "@dfinity/auth-client";
import { InternetIdentity } from "@dfinity/auth-client/lib/cjs/internet-identity";

const App = () => {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authClient, setAuthClient] = useState(null);
  const [backend, setBackend] = useState(null);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const client = await AuthClient.create();
      setAuthClient(client);
      
      const isAuthenticated = await client.isAuthenticated();
      setIsAuthenticated(isAuthenticated);
      
      if (isAuthenticated) {
        await initializeBackend(client);
      }
    } catch (error) {
      console.error("Failed to initialize auth client:", error);
    }
  };

  const initializeBackend = async (client) => {
    try {
      const identity = client.getIdentity();
      const agent = new HttpAgent({ identity });
      
      // For local development, we'll use a mock canister ID
      // In production, this would be the actual deployed canister ID
      const canisterId = "rrkah-fqaaa-aaaaa-aaaaq-cai"; // Mock ID for now
      
      // Create a mock actor for now - in real deployment, you'd import the actual IDL
      const mockActor = {
        createPost: async (content, fileUrl) => {
          // Mock implementation
          const newPost = {
            id: posts.length + 1,
            content,
            fileUrl,
            likes: 0,
            comments: [],
            author: identity.getPrincipal().toText(),
            timestamp: Date.now(),
          };
          setPosts(prev => [newPost, ...prev]);
          return newPost.id;
        },
        getPosts: async () => posts,
        likePost: async (id) => {
          setPosts(prev => prev.map(post => 
            post.id === id ? { ...post, likes: post.likes + 1 } : post
          ));
          return true;
        },
        addComment: async (id, text) => {
          const newComment = {
            id: Date.now(),
            text,
            author: identity.getPrincipal().toText(),
            timestamp: Date.now(),
          };
          setPosts(prev => prev.map(post => 
            post.id === id 
              ? { ...post, comments: [...post.comments, newComment] }
              : post
          ));
          return true;
        }
      };
      
      setBackend(mockActor);
      await fetchPosts();
    } catch (error) {
      console.error("Failed to initialize backend:", error);
    }
  };

  const login = async () => {
    if (!authClient) return;
    
    try {
      await authClient.login({
        identityProvider: process.env.REACT_APP_INTERNET_IDENTITY_URL || "https://identity.ic0.app",
        onSuccess: async () => {
          setIsAuthenticated(true);
          await initializeBackend(authClient);
        },
      });
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const logout = async () => {
    if (!authClient) return;
    
    await authClient.logout();
    setIsAuthenticated(false);
    setBackend(null);
    setPosts([]);
  };

  const fetchPosts = async () => {
    if (!backend) return;
    
    try {
      setLoading(true);
      const data = await backend.getPosts();
      setPosts(data);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const createPost = async () => {
    if (!backend || !content.trim() || !fileUrl.trim()) {
      alert("Please fill in both content and file URL!");
      return;
    }

    try {
      setLoading(true);
      await backend.createPost(content, fileUrl);
      setContent("");
      setFileUrl("");
      alert("Post created successfully!");
    } catch (error) {
      console.error("Failed to create post:", error);
      alert("Failed to create post!");
    } finally {
      setLoading(false);
    }
  };

  const likePost = async (id) => {
    if (!backend) return;
    
    try {
      await backend.likePost(id);
    } catch (error) {
      console.error("Failed to like post:", error);
    }
  };

  const addComment = async (id) => {
    if (!backend) return;
    
    const comment = prompt("Enter your comment:");
    if (!comment?.trim()) return;
    
    try {
      await backend.addComment(id, comment);
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Civitas</h1>
            <p className="text-gray-600">Decentralized Social Media Platform</p>
          </div>
          <button
            onClick={login}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Login with Internet Identity
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Civitas</h1>
          <button
            onClick={logout}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Create Post Form */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Create Post</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's on your mind?"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                File URL
              </label>
              <input
                type="text"
                value={fileUrl}
                onChange={(e) => setFileUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={createPost}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating..." : "Create Post"}
            </button>
          </div>
        </div>

        {/* Posts Feed */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Posts</h2>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No posts yet. Be the first to create one!
            </div>
          ) : (
            posts.map((post) => (
              <div key={post.id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-sm text-gray-500">
                        {post.author ? `${post.author.slice(0, 8)}...` : "Anonymous"}
                      </span>
                      <span className="text-gray-400">•</span>
                      <span className="text-sm text-gray-500">
                        {new Date(post.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-900 mb-4">{post.content}</p>
                    {post.fileUrl && (
                      <img
                        src={post.fileUrl}
                        alt="Post attachment"
                        className="max-w-full h-auto rounded-lg mb-4"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    )}
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => likePost(post.id)}
                        className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition-colors"
                      >
                        <span>❤️</span>
                        <span>{post.likes}</span>
                      </button>
                      <button
                        onClick={() => addComment(post.id)}
                        className="text-gray-600 hover:text-blue-600 transition-colors"
                      >
                        💬 Comment
                      </button>
                    </div>
                    
                    {/* Comments */}
                    {post.comments.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Comments:</h4>
                        <div className="space-y-2">
                          {post.comments.map((comment) => (
                            <div key={comment.id} className="bg-gray-50 rounded-lg p-3">
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="text-xs text-gray-500">
                                  {comment.author ? `${comment.author.slice(0, 8)}...` : "Anonymous"}
                                </span>
                                <span className="text-gray-400">•</span>
                                <span className="text-xs text-gray-500">
                                  {new Date(comment.timestamp).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-sm text-gray-900">{comment.text}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default App; 