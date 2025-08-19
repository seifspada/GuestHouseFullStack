export enum NotificationType {
  EVENT = 'event',
  PROMOTION = 'promotion',
  SERVICE_UPDATE = 'service_update',
  RESERVATION = 'reservation',
  WELCOME = 'welcome',
  GENERAL = 'general',
}

export enum RecipientGroup {
  ALL_GUESTS = 'all_guests',
  CURRENT_GUESTS = 'current_guests',
  SPECIFIC_GUEST = 'specific_guest',
}

export interface CreateNotificationDto {
  type: NotificationType;
  recipientGroup: RecipientGroup;
  specificGuestId?: string;
  title: string;
  message: string;
  isUrgent?: boolean;
}

export interface AppNotification {
  title: string;
  message: string;
  timeAgo: string;
}
