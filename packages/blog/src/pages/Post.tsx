import { Link, useLoaderData } from "react-router-dom";

function Post() {
  const { post } = useLoaderData() as {
    post: {
      title: string;
      id: string;
      content: string;
      updatedAt: string;
      author: { profile: { firstName: string; lastName: string } };
    };
  };

  return (
    <div className="flex flex-col">
      <div className="text-left">
        <Link to={"/"}>
          <p className="inline-block font-light bg-teal-500 text-white rounded-md p-1 shadow-md drop-shadow-md">
            👈🏼 Volver
          </p>
        </Link>
      </div>
      <div className="justify-center">
        <h1 className="text-3xl">
          {post.title}{" "}
          <small className="text-sm ml-5 bg-teal-500 text-white rounded-md p-1">
            {new Date(Date.parse(post.updatedAt)).toLocaleString()}
          </small>
        </h1>
        <br />
        <p className="text-justify">{post.content}</p>
        <div className='text-right'>
          <p className='inline-block font-light bg-teal-500 text-white rounded-md p-1 shadow-md drop-shadow-md'>
            🧑🏻‍💻 Author: {post.author.profile.firstName} {post.author.profile.lastName}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Post;
