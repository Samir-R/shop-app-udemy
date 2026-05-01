import _ from 'lodash';
import { getDay, getHours, getMinutes } from 'date-fns';

const computeIsOpen = (schedule) => {
  if (!schedule?.openingHours) return false;
  const now = new Date();
  const dayRanges = schedule.openingHours[String(getDay(now))] || [];
  if (dayRanges.length === 0) return false;
  const currentTotalMin = getHours(now) * 60 + getMinutes(now);
  return dayRanges.some((range) => {
    const [startH, startM] = range.start.split(':').map(Number);
    const [endH, endM] = range.end.split(':').map(Number);
    return currentTotalMin >= startH * 60 + startM && currentTotalMin < endH * 60 + endM;
  });
};

export default class Shop {
  constructor(data) {
    this.id = _.get(data, 'id');
    this.name = _.get(data, 'name');
    const addr = _.get(data, 'address');
    if (addr && typeof addr === 'object') {
      const parts = [addr.street1, addr.street2, addr.zipcode, addr.city].filter(Boolean);
      this.address = parts.join(', ');
      this.city = addr.city ?? null;
      this.lat = addr.lat ?? null;
      this.lng = addr.lng ?? null;
    } else {
      this.address = addr ?? null;
      this.city = null;
      this.lat = null;
      this.lng = null;
    }
    this.image = _.get(data, 'image');
    this.cuisine = _.get(data, 'cuisine');
    this.rating = _.get(data, 'rating');
    this.deliveryTime = _.get(data, 'deliveryTime');
    this.schedule = _.get(data, 'schedule');
    this.optionsAvailable = _.get(data, 'optionsAvailable', []);
    this.isOpen = this.schedule ? computeIsOpen(this.schedule) : _.get(data, 'isOpen', false);
  }
}
