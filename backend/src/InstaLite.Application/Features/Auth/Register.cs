using FluentValidation;
using InstaLite.Application.Common.Abstractions;
using InstaLite.Application.Common.Messaging;
using InstaLite.Application.Common.Results;
using InstaLite.Domain.Users;
using Microsoft.EntityFrameworkCore;

namespace InstaLite.Application.Features.Auth;

public sealed record RegisterCommand(string Username, string Email, string Password, string? DisplayName)
    : ICommand<AuthResult>;

public sealed class RegisterValidator : AbstractValidator<RegisterCommand>
{
    public RegisterValidator()
    {
        RuleFor(x => x.Username).ValidUsername();
        RuleFor(x => x.Email).NotEmpty().EmailAddress().MaximumLength(User.EmailMaxLength);
        RuleFor(x => x.Password).ValidPassword();
        RuleFor(x => x.DisplayName).MaximumLength(User.DisplayNameMaxLength);
    }
}

/// <summary>Creates a new account and signs the user in straight away.</summary>
public sealed class RegisterHandler(
    IAppDbContext db,
    IPasswordHasher passwordHasher,
    SessionIssuer sessionIssuer,
    TimeProvider clock)
    : ICommandHandler<RegisterCommand, AuthResult>
{
    public async Task<Result<AuthResult>> Handle(RegisterCommand command, CancellationToken cancellationToken)
    {
        var username = User.NormalizeUsername(command.Username);
        var email = User.NormalizeEmail(command.Email);

        if (await db.Users.AnyAsync(u => u.Username == username, cancellationToken))
            return AuthErrors.UsernameTaken;

        if (await db.Users.AnyAsync(u => u.Email == email, cancellationToken))
            return AuthErrors.EmailTaken;

        var user = User.Create(
            username,
            email,
            command.DisplayName ?? username,
            passwordHasher.Hash(command.Password),
            clock.GetUtcNow().UtcDateTime);

        db.Users.Add(user);
        var session = sessionIssuer.Issue(user);
        await db.SaveChangesAsync(cancellationToken);

        return session;
    }
}
