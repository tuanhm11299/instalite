using InstaLite.Application.Common.Abstractions;
using InstaLite.Application.Common.Messaging;
using InstaLite.Application.Common.Pagination;
using InstaLite.Application.Common.Results;
using InstaLite.Application.Features.Users;
using InstaLite.Domain.Users;
using Microsoft.EntityFrameworkCore;

namespace InstaLite.Application.Features.Posts;

public sealed record GetUserPostsQuery(string Username, string? Cursor, int? PageSize) : IQuery<CursorPage<PostDto>>;

/// <summary>All posts of one user, newest first (the grid on a profile page).</summary>
public sealed class GetUserPostsHandler(IAppDbContext db, ICurrentUser currentUser)
    : IQueryHandler<GetUserPostsQuery, CursorPage<PostDto>>
{
    public async Task<Result<CursorPage<PostDto>>> Handle(GetUserPostsQuery query, CancellationToken cancellationToken)
    {
        var pageSize = Cursor.ClampPageSize(query.PageSize);
        var username = User.NormalizeUsername(query.Username);

        var authorId = await db.Users
            .Where(u => u.Username == username)
            .Select(u => (Guid?)u.Id)
            .SingleOrDefaultAsync(cancellationToken);

        if (authorId is null) return UserErrors.NotFound;

        var posts = db.Posts.AsNoTracking().Where(p => p.AuthorId == authorId);

        var before = Cursor.ToDate(query.Cursor);
        if (before is not null) posts = posts.Where(p => p.CreatedAt < before);

        var items = await posts
            .OrderByDescending(p => p.CreatedAt)
            .Take(pageSize + 1)
            .Select(PostProjections.ToPostDto(currentUser.Id))
            .ToListAsync(cancellationToken);

        return CursorPage<PostDto>.FromOverfetched(items, pageSize, post => Cursor.FromDate(post.CreatedAt));
    }
}
