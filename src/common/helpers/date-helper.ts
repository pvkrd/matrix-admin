import * as moment from 'moment-timezone';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DateHelper {

  // this will return the current milli seconds from the epoch
   getCurrentMillisseconds() {
    return Date.now();
  }
  /**
   * Converts a date string to UTC format.
   * @param datetimeString The date string to convert.
   * @returns The date string in UTC format.
   */
  convertToUTC(datetimeString: string): string {
    const utcFormat = moment
      .utc(datetimeString, 'YYYY-MM-DD h:mmA')
      .format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
    return utcFormat;
  }

  /**
   * Converts a local time to UTC time.
   * @param localTime The local time to convert.
   * @param userTimeZone The user's time zone.
   * @returns The local time converted to UTC time.
   */
  convertLocalTimeToUTC(localTime: string, userTimeZone: string) {
    console.log(
      'utc time: ' +
        moment.tz(localTime, 'YYYY-MM-DD h:mma', userTimeZone).utc().format(),
    );
    return moment
      .tz(localTime, 'YYYY-MM-DD h:mma', userTimeZone)
      .utc()
      .format();
  }

  /**
   * Calculates the end time based on the start time and duration.
   * @param startTime The start time.
   * @param durationInMinutes The duration in minutes.
   * @returns The end time.
   */
  calculateEndTime(startTime: Date, durationInMinutes: number): Date {
    const durationInMilliseconds = durationInMinutes * 60 * 1000;
    const endTime = new Date(
      new Date(startTime).getTime() + durationInMilliseconds,
    );
    return endTime;
  }

  /**
   * Reduces minutes from a date.
   * @param startTime The start time.
   * @param durationInMinutes The duration in minutes to reduce.
   * @returns The updated date.
   */
  reduceMinutes(startTime: Date, durationInMinutes: number): Date {
    const durationInMilliseconds = durationInMinutes * 60 * 1000;
    const endTime = new Date(
      new Date(startTime).getTime() - durationInMilliseconds,
    );
    return endTime;
  }

  /**
   * Checks if two time intervals overlap.
   * @param start1 The start time of the first interval.
   * @param end1 The end time of the first interval.
   * @param start2 The start time of the second interval.
   * @param end2 The end time of the second interval.
   * @returns True if the intervals overlap, false otherwise.
   */
  checkTimeOverlap(
    start1: Date,
    end1: Date,
    start2: Date,
    end2: Date,
  ): boolean {
    return start1 <= end2 && end1 >= start2;
  }

  /**
   * Reduces seconds from a date.
   * @param startTime The start time.
   * @param durationInMinutes The duration in seconds to reduce.
   * @returns The updated date.
   */
  reduceSeconds(startTime: Date, durationInSeconds: number): Date {
    const durationInMilliseconds = durationInSeconds * 1000;
    const endTime = new Date(
      new Date(startTime).getTime() - durationInMilliseconds,
    );
    return endTime;
  }

  /**
   * Adds seconds to a date.
   * @param startTime The start time.
   * @param durationInMinutes The duration in seconds to add.
   * @returns The updated date.
   */
  addSeconds(startTime: Date, durationInSeconds: number): Date {
    const durationInMilliseconds = durationInSeconds * 1000;
    const endTime = new Date(
      new Date(startTime).getTime() + durationInMilliseconds,
    );
    return endTime;
  }

  /**
   * Converts a date to Virginia time zone.
   * @param date The date to convert.
   * @returns The date_string in Virginia time zone.
   */
  convertToVirginiaTimeZone(date: Date): string {
    const virginaTime = date.toLocaleString('en-US', {
      timeZone: 'America/New_York',
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
    return virginaTime;
  }

  /**
   * Calculates the difference in hours between two dates.
   * @param date1 The first date.
   * @param date2 The second date.
   * @returns The difference in hours.
   */
  calculateDateDifferenceInHrs(date1: Date, date2: Date) {
    return (date1.getTime() - date2.getTime()) / 36e5;
  }

  /**
   * Calculates the difference in minutes between two dates.
   * @param date1 The first date.
   * @param date2 The second date.
   * @returns The difference in minutes.
   */
  calculateDateDifferenceInMinutes(date1: Date, date2: Date) {
    return (date1.getTime() - date2.getTime()) / 6e4;
  }

  /**
   * Calculates the difference in hours between a date and the current time.
   * @param dateInUTC The date in UTC format.
   * @returns The difference in hours.
   */
  calculateDifferenceFromNowInHrs(dateInUTC: Date) {
    return this.calculateDateDifferenceInHrs(dateInUTC, new Date());
  }

  /**
   * Returns a date as a string in yyyy-mm-dd format.
   * @param date The date to format.
   * @returns The date string in yyyy-mm-dd format.
   */
  fetchStandardizedDateString(date: Date): string {
    return date.toJSON().slice(0, 10);
  }

  /**
   * Returns a date as a string in yyyyMMddhhmmss format.
   * @param date The date to format.
   * @returns The date string in yyyyMMddhhmmss format.
   * @remarks This method is used to format dates for the database.
   */
  getFormattedDate() {
    const now = new Date();
    const year = now.getUTCFullYear();
    const month = (now.getUTCMonth() + 1).toString().padStart(2, '0');
    const day = now.getUTCDate().toString().padStart(2, '0');
    const hours = now.getUTCHours().toString().padStart(2, '0');
    const minutes = now.getUTCMinutes().toString().padStart(2, '0');
    const seconds = now.getUTCSeconds().toString().padStart(2, '0');

    return `${year}${month}${day}${hours}${minutes}${seconds}`;
  }
}
