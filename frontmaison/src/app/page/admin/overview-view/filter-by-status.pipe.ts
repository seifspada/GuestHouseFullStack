import { Pipe, PipeTransform } from '@angular/core';

     @Pipe({
       name: 'filterByStatus',
       standalone: true
     })
     export class FilterByStatusPipe implements PipeTransform {
       transform(items: any[], status: string): any[] {
         return items.filter(item => item.status === status);
       }
     }