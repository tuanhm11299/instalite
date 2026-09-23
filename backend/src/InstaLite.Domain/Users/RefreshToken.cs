using InstaLite.Domain.Common;

namespace InstaLite.Domain.Users;

/// <summary>
/// A long-lived token that lets the browser get a new short-lived access token without
/// asking for the password again. Only a hash of the token is stored, so a leaked database
/// does not leak usable tokens.
/// </summary>
public sealed class RefreshToken : Entity
{
    private RefreshToken() { }

    public Guid UserId { get; private set; }
    public User User { get; private set; } = null!;

    public string TokenHash { get; private set; } = null!;
    public DateTime CreatedAt { get; private set; }
    public DateTime ExpiresAt { get; private set; }
    public DateTime? RevokedAt { get; private set; }

    public static RefreshToken Create(Guid userId, string tokenHash, DateTime now, TimeSpan lifetime) => new()
    {
        UserId = userId,
        TokenHash = tokenHash,
        CreatedAt = now,
        ExpiresAt = now.Add(lifetime),
    };

    public bool IsActive(DateTime now) => RevokedAt is null && ExpiresAt > now;

    public void Revoke(DateTime now) => RevokedAt ??= now;
}
