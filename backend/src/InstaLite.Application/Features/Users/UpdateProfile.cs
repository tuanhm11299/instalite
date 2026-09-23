using FluentValidation;
using InstaLite.Application.Common.Abstractions;
using InstaLite.Application.Common.Messaging;
using InstaLite.Application.Common.Results;
using InstaLite.Application.Features.Auth;
using InstaLite.Domain.Users;
using Microsoft.EntityFrameworkCore;

namespace InstaLite.Application.Features.Users;

public sealed record UpdateProfileCommand(string DisplayName, string? Bio) : ICommand<CurrentUserDto>;

public sealed class UpdateProfileValidator : AbstractValidator<UpdateProfileCommand>
{
    public UpdateProfileValidator()
    {
        RuleFor(x => x.DisplayName).NotEmpty().MaximumLength(User.DisplayNameMaxLength);
        RuleFor(x => x.Bio).MaximumLength(User.BioMaxLength);
    }
}

public sealed class UpdateProfileHandler(IAppDbContext db, ICurrentUser currentUser)
    : ICommandHandler<UpdateProfileCommand, CurrentUserDto>
{
    public async Task<Result<CurrentUserDto>> Handle(UpdateProfileCommand command, CancellationToken cancellationToken)
    {
        var user = await db.Users.SingleOrDefaultAsync(u => u.Id == currentUser.Id, cancellationToken);
        if (user is null) return AuthErrors.UserNotFound;

        user.UpdateProfile(command.DisplayName, command.Bio);
        await db.SaveChangesAsync(cancellationToken);

        return CurrentUserDto.From(user);
    }
}
