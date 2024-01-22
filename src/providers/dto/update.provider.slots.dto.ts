// provider-slots.dto.ts

/**
 * Data Transfer Object (DTO) for a slot.
 * Contains the staff resource ID and an array of calendar dates.
 */
export class SlotDto {
  // The ID of the staff resource associated with this slot
  staffResourceId: number;

  // An array of dates for this slot
  calendarDates: string[];
}

/**
 * Data Transfer Object (DTO) for a provider slot.
 * Contains an array of slots.
 */
export class UpdateProviderSlotDto {
  // An array of slots for this provider
  fileName: string;
  slots: SlotDto[];
}
