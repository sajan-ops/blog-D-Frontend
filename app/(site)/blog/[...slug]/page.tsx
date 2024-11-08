import { fetchPostDetails } from "@/components/Blog/blogData";
import RelatedPost from "@/components/Blog/RelatedPost";
import SharePost from "@/components/Blog/SharePost";
import CommentsSection from "@/components/comments";
import { getMediaUrlPath } from "@/lib/mediaUrl";
import Likes from "@/components/likes"; // Import the Likes component

const PostDetailsPage = async ({ params: { slug } }) => {
  const post = await fetchPostDetails(slug);
  if (!post) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg text-gray-600">Post not found</p>
      </div>
    );
  }

  return (
    <>
      <div className="mx-auto max-w-4xl pt-25">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {JSON.parse(post.filePath).map((filePath: any, index: any) => (
            <img
              key={index} // Use index as key (consider using a unique identifier if available)
              src={getMediaUrlPath(filePath)}
              alt={post.title}
              className="mb-6 h-[400px] w-full rounded-lg object-cover"
            />
          ))}
        </div>
        <h1 className="mb-4 text-3xl font-bold">{post.title}</h1>
        <div className="mb-6">
          <span className="text-sm text-gray-500">
            Posted on {new Date(post.date_created_in).toLocaleDateString()}
          </span>
        </div>

        <div>
          <p className="text-gray-700">{post.description}</p>
          {post.content && (
            <div
              dangerouslySetInnerHTML={{ __html: post.content }}
              className="mt-6 whitespace-pre-wrap text-gray-700"
            />
          )}
        </div>
        {/* Likes Component */}
        <Likes initialLiked={post.isLiked || false} postId={post.slug} />
      </div>
      {/* Comments on this post */}
      <CommentsSection slug={post.slug} />
      <div className="p-10">
        <SharePost title={post.title} url={post.slug} />
        <br />
        <RelatedPost category={post.category} />
      </div>
    </>
  );
};

export default PostDetailsPage;
