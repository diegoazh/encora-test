// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function PostLoader({ params }: { params: any }) {
  try {
    const res = await fetch(`http://localhost:3000/posts/${params.postId}`);
    const resJson = await res.json();
    const post = {...resJson.data.item};
    return { post };
  } catch (error) {
    console.error(error);
  }
}
