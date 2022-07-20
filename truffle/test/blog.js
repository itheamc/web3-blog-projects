const Blog = artifacts.require("Blog");

contract('Blog', () => {
  it('should read newly written values', async() => {
    const blogInstance = await Blog.deployed();

    await blogInstance.getPost(1);
});
