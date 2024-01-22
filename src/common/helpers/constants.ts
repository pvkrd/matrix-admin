export class Constants {
  static readonly SCHEDULED_VISITS_STATUS = [
    'SCHEDULED',
    'ARRIVED',
    'ASSESSMENT_STARTED',
    'ASSESSMENT_ENDED',
    'DEPARTURE',
  ];
  static readonly UN_SCHEDULED_VISITS_STATUS = ['UNSCHEDULED', 'CANCELLED'];

  static readonly PROVIDER_CANCELLATION_REASONS = ['Unclaimed'];

  static readonly MEMBER_CANCELLATION_REASONS = [
    'Member No Show',
    'Member Declined visit and needs to reschedule',
    'Member in Hospice/SNF',
    'Remove from call List',
    'Provider Safety Concern',
  ];

  /**
   * Timeout duration in milliseconds for HTTP requests to third-party APIs.
   * Requests that exceed this timeout will be aborted.
   * E.g. 5000 for 5 seconds.
   * @type {number}
   */
  static readonly TPA_HTTP_TIMEOUT_MS = 10000;

  static readonly ACTIVE_STATUS = 2;

  static readonly TELE_HEALTH = 'Telehealth';

  static readonly PHYSICAL_ADDRESS = 'physical';

  static readonly MAILING_ADDRESS = 'mailing';

  static readonly PRIMARY = "primary";
  static readonly PERSONAL_CELL = "personal cell";

  /**
   * Maximum number of retry attempts when interacting
   * with a third-party service.
   * E.g. Calender API calls, Mapbox API calls etc.
   * @type {number}
   */
  static readonly TPA_MAX_RETRIES = 3;

  /**
   * Delay in milliseconds between retry attempts for
   * interactions with a third-party service.
   * E.g. Calender API calls, Mapbox API calls etc.
   * @type {number}
   */
  static readonly TPA_RETRY_DELAY_MS = 1000;

  /**
   * List of HTTP status codes to exclude from retry attempts.
   * These status codes indicate non-retryable errors.
   * @type {number[]}
   */
  static readonly TPA_EXCLUDED_HTTP_STATUS_CODES = [400, 401, 403, 404, 500];
  static readonly SCHEDULED: string = 'SCHEDULED';
  static readonly UNSCHEDULED: string = 'UNSCHEDULED';
  static readonly CANCELED: string = 'CANCELLED';
  static readonly MemberNotificationScheduler: string = 'MemberNotification';
  static readonly ProviderNotificationScheduler: string =
    'ProviderNotification';
  static readonly inboundChaFeed: string = 'inboundChaFeed';
  static readonly outboundChaFeed: string = 'outboundChaFeed';
  static readonly EVERY_15_MINUTES: string = '0 */15 * * * *';
  static readonly ACTIVE: string = 'ACTIVE';
  static readonly EVERY_DAY_AT_6_30_AM = "30 6 * * *";
  static readonly PlannedVisitRouteScheduler: string = 'PlannedVisitRoute';
}
