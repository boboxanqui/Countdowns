import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'dateFormat'
})
export class DatePipe implements PipeTransform {

  constructor( private translate: TranslateService ) { }

  transform( date: Date ): string | Date {
    if( this.translate.currentLang == 'es'){
      return `${ date.getDate() }/${ date.getMonth() + 1 }/${ date.getFullYear()}`
    }
    return `${ date.getMonth() + 1 }/${ date.getDate() }/${ date.getFullYear()}`;
  }

}
