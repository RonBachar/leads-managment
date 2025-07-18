import { Pipe, PipeTransform } from '@angular/core';
import { UtilsService } from '../services/utils.service';
import { PACKAGE_LABELS } from '../constants/app.constants';

@Pipe({
  name: 'format',
  standalone: true,
})
export class FormatPipe implements PipeTransform {
  private utils = new UtilsService();

  transform(value: any, type: 'date' | 'currency' | 'package'): string {
    switch (type) {
      case 'date':
        return this.utils.formatDate(value);

      case 'currency':
        return this.utils.formatCurrency(value);

      case 'package':
        return PACKAGE_LABELS[value] || value;

      default:
        return value;
    }
  }
}
