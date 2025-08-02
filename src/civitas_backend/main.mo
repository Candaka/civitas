import Debug "mo:base/Debug";
import Time "mo:base/Time";
import Array "mo:base/Array";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Error "mo:base/Error";
import Principal "mo:base/Principal";

actor {
    type PostId = Nat;
    type CommentId = Nat;
    type UserId = Principal;

    public type Post = {
        id: PostId;
        content: Text;
        fileUrl: Text;
        likes: Nat;
        comments: [Comment];
        author: UserId;
        timestamp: Int;
    };

    public type Comment = {
        id: CommentId;
        text: Text;
        author: UserId;
        timestamp: Int;
    };

    private stable var posts: [Post] = [];
    private stable var nextPostId: Nat = 1;
    private stable var nextCommentId: Nat = 1;

    // Create a new post
    public shared({caller}) func createPost(content: Text, fileUrl: Text) : async PostId {
        let post: Post = {
            id = nextPostId;
            content = content;
            fileUrl = fileUrl;
            likes = 0;
            comments = [];
            author = caller;
            timestamp = Time.now();
        };
        
        posts := Array.append(posts, [post]);
        nextPostId += 1;
        
        return post.id;
    };

    // Get all posts
    public query func getPosts() : async [Post] {
        return posts;
    };

    // Like a post
    public shared({caller}) func likePost(postId: PostId) : async Bool {
        for (i in posts.keys()) {
            if (posts[i].id == postId) {
                let updatedPost: Post = {
                    id = posts[i].id;
                    content = posts[i].content;
                    fileUrl = posts[i].fileUrl;
                    likes = posts[i].likes + 1;
                    comments = posts[i].comments;
                    author = posts[i].author;
                    timestamp = posts[i].timestamp;
                };
                
                posts[i] := updatedPost;
                return true;
            };
        };
        return false;
    };

    // Add a comment to a post
    public shared({caller}) func addComment(postId: PostId, text: Text) : async Bool {
        let comment: Comment = {
            id = nextCommentId;
            text = text;
            author = caller;
            timestamp = Time.now();
        };
        
        for (i in posts.keys()) {
            if (posts[i].id == postId) {
                let updatedComments = Array.append(posts[i].comments, [comment]);
                let updatedPost: Post = {
                    id = posts[i].id;
                    content = posts[i].content;
                    fileUrl = posts[i].fileUrl;
                    likes = posts[i].likes;
                    comments = updatedComments;
                    author = posts[i].author;
                    timestamp = posts[i].timestamp;
                };
                
                posts[i] := updatedPost;
                nextCommentId += 1;
                return true;
            };
        };
        return false;
    };

    // Get a specific post by ID
    public query func getPost(postId: PostId) : async ?Post {
        for (post in posts.vals()) {
            if (post.id == postId) {
                return ?post;
            };
        };
        return null;
    };

    // Get posts by author
    public query func getPostsByAuthor(author: UserId) : async [Post] {
        let authorPosts: [var ?Post] = Array.init(posts.size(), null);
        var count = 0;
        
        for (post in posts.vals()) {
            if (post.author == author) {
                authorPosts[count] := ?post;
                count += 1;
            };
        };
        
        let result: [Post] = [];
        for (i in authorPosts.keys()) {
            switch (authorPosts[i]) {
                case (?post) {
                    result := Array.append(result, [post]);
                };
                case null {};
            };
        };
        
        return result;
    };

    // System functions for upgrades
    system func preupgrade() {
        // This will be called before an upgrade
    };

    system func postupgrade() {
        // This will be called after an upgrade
    };
}; 