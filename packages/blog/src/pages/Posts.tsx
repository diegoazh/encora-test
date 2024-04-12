import { Link, useLoaderData } from "react-router-dom";

function Posts() {
  const { posts } = useLoaderData() as {
    posts: { title: string; id: string }[];
  };

  const postList = posts.map((post, index) => (
    <h1 className="text-xl font-bold" key={index} role="button">
      <Link to={`posts/${post.id}`}>📄 {post?.title}</Link>
    </h1>
  ));

  return (
    <>
      <h1 className="text-2xl font-bold mb-5 underline block text-left">
        Our posts
      </h1>
      <div className="text-left w-2/3 m-auto">
        {postList.length ? (
          postList
        ) : (
          <p className="text-2xl font-light mb-5 block text-left text-stone-400">
            No se encontraron posts...
          </p>
        )}
      </div>
    </>
  );
}

export default Posts;
