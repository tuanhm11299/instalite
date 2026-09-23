using InstaLite.Api.Common;
using InstaLite.Application.Common.Messaging;
using InstaLite.Application.Common.Pagination;
using InstaLite.Application.Common.Results;
using InstaLite.Application.Features.Notifications;

namespace InstaLite.Api.Endpoints;

internal static class NotificationEndpoints
{
    public static void MapNotificationEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/notifications").WithTags("Notifications").RequireAuthorization();

        group.MapGet("/", async (
                string? cursor,
                int? pageSize,
                IQueryHandler<GetNotificationsQuery, CursorPage<NotificationDto>> handler,
                CancellationToken cancellationToken) =>
            (await handler.Handle(new GetNotificationsQuery(cursor, pageSize), cancellationToken)).ToHttpResult());

        group.MapGet("/unread-count", async (
                IQueryHandler<GetUnreadNotificationCountQuery, UnreadCountDto> handler,
                CancellationToken cancellationToken) =>
            (await handler.Handle(new GetUnreadNotificationCountQuery(), cancellationToken)).ToHttpResult());

        group.MapPost("/mark-read", async (
                ICommandHandler<MarkNotificationsReadCommand, Unit> handler,
                CancellationToken cancellationToken) =>
            (await handler.Handle(new MarkNotificationsReadCommand(), cancellationToken)).ToHttpResult());
    }
}
