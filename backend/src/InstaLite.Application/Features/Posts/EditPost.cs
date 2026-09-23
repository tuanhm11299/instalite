using FluentValidation;
using InstaLite.Application.Common.Abstractions;
using InstaLite.Application.Common.Messaging;
using InstaLite.Application.Common.Results;
using InstaLite.Domain.Posts;
using Microsoft.EntityFrameworkCore;

namespace InstaLite.Application.Features.Posts;

/// <summary>Only the caption can be edited; photos are fixed once posted (same as Instagram).</summary>
public sealed record EditPostCommand(Guid PostId, string? Caption) : ICommand<PostDto>;

public sealed class EditPostValidator : AbstractValidator<EditPostCommand>
{
    public EditPostValidator()
    {
        RuleFor(x => x.Caption).MaximumLength(Post.CaptionMaxLength);
    }
}

public sealed class EditPostHandler(IAppDbContext db, ICurrentUser currentUser)
    : ICommandHandler<EditPostCommand, PostDto>
{
    public async Task<Result<PostDto>> Handle(EditPostCommand command, CancellationToken cancellationToken)
    {
        var me = currentUser.Id;

        var post = await db.Posts.SingleOrDefaultAsync(p => p.Id == command.PostId, cancellationToken);
        if (post is null) return PostErrors.NotFound;
        if (!post.IsAuthoredBy(me)) return PostErrors.NotAuthor;

        post.EditCaption(command.Caption);
        await db.SaveChangesAsync(cancellationToken);

        return await db.Posts
            .AsNoTracking()
            .Where(p => p.Id == post.Id)
            .Select(PostProjections.ToPostDto(me))
            .SingleAsync(cancellationToken);
    }
}
