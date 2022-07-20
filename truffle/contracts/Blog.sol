// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

contract Blog {
    struct Post {
        uint256 id;
        string title;
        string content;
        address creator;
        uint256 timestamp;
    }

    uint256 postsCount;
    mapping(uint256 => Post) public posts;

    function createPost(string memory _title, string memory _content) public {
        postsCount++;
        posts[postsCount] = Post(
            postsCount,
            _title,
            _content,
            msg.sender,
            block.timestamp
        );
    }

    function getPost(uint256 _id)
        public
        view
        returns (
            uint256,
            string memory,
            string memory,
            address,
            uint256
        )
    {
        Post memory post = posts[_id];
        return (
            post.id,
            post.title,
            post.content,
            post.creator,
            post.timestamp
        );
    }

    function getPosts() public view returns (Post[] memory) {
        Post[] memory postsArray = new Post[](postsCount);
        for (uint256 i = 0; i < postsCount; i++) {
            postsArray[i] = posts[i + 1];
        }
        return postsArray;
    }
}
