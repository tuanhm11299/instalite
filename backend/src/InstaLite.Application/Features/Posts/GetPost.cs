using InstaLite.Application.Common.Abstractions;
using InstaLite.Application.Common.Messaging;
using InstaLite.Application.Common.Results;
using Microsoft.EntityFrameworkCore;

namespace InstaLite.Application.Features.Posts;

public sealed record GetPostQuery(Guid PostId) : IQuery<PostDto>;

public sealed class GetPostHandler(IAppDbContext db, ICurrentUser currentUser)
    : IQueryHandler<GetPostQuery, PostDto>
{
    public async Task<Result<PostDto>> Handle(GetPostQuery query, CancellationToken cancellationToken)
    {
        var post = await db.Posts
            .AsNoTracking()
            .Where(p => p.Id == query.PostId)
            .Select(PostProjections.ToPostDto(currentUser.Id))
            .SingleOrDefaultAsync(cancellationToken);

        return post is null ? PostErrors.NotFound : post;
    }
}
