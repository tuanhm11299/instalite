using InstaLite.Application.Common.Abstractions;
using InstaLite.Application.Common.Messaging;
using InstaLite.Application.Common.Results;
using Microsoft.EntityFrameworkCore;

namespace InstaLite.Application.Features.Comments;

public sealed record DeleteCommentCommand(Guid CommentId) : ICommand<Unit>;

public sealed class DeleteCommentHandler(IAppDbContext db, ICurrentUser currentUser)
    : ICommandHandler<DeleteCommentCommand, Unit>
{
    public async Task<Result<Unit>> Handle(DeleteCommentCommand command, CancellationToken cancellationToken)
    {
        var comment = await db.Comments
            .Include(c => c.Post)
            .SingleOrDefaultAsync(c => c.Id == command.CommentId, cancellationToken);

        if (comment is null) return CommentErrors.NotFound;
        if (!comment.CanBeDeletedBy(currentUser.Id, comment.Post.AuthorId)) return CommentErrors.CannotDelete;

        db.Comments.Remove(comment);
        await db.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}
