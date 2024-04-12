export async function PostsLoader() {
  try {
    const res = await fetch("http://localhost:3000/posts");
    const resJson = await res.json();
    const posts = [...resJson.data.items];
    return { posts };
  } catch (error) {
    console.error(error);
  }
}
