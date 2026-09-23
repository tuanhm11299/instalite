using InstaLite.Application.Common.Results;

namespace InstaLite.Application.Features.Posts;

public static class PostErrors
{
    public static readonly Error NotFound = Error.NotFound("Post.NotFound", "This post does not exist or was deleted.");

    public static readonly Error NotAuthor = Error.Forbidden("Post.NotAuthor", "Only the author can change this post.");
}
