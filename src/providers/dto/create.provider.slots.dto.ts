// provider-slots.dto.ts

/**
 * Data Transfer Object (DTO) for a provider slot.
 * Contains an array of slots.
 */
export class CreateProviderSlotDto {
  startDate: string;
  endDate: string;
  startTime: number;
  endTime: number;
}
