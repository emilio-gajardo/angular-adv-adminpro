import { Component, OnDestroy } from '@angular/core';
import { Observable, interval, Subscription } from 'rxjs';
import { retry, take, map, filter } from 'rxjs/operators';

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: [
  ]
})
export class RxjsComponent implements OnDestroy {

  public intervalSubs: Subscription;

  constructor() {
    // this.retornaObservable().pipe(
    //   retry(1)
    // ).subscribe(
    //   valor => console.log('Subscripcion: ', valor),
    //   error => console.warn('Error: ', error),
    //   () => console.info('Observable terminado')
    // );

    //this.intervalSubs = this.retornaIntervalo().subscribe(console.log);
  }

  //EJ 18-03-2021
  ngOnDestroy(): void {
    this.intervalSubs.unsubscribe();
  }

  //EJ 18-03-2021
  retornaIntervalo(): Observable<number> {
    const intervalo$ = interval(100)
      .pipe(
        map(valor => valor + 1),
        filter(valor => (valor % 2 === 0 ) ? true: false), //true=par, false=impar
        //take(10),
      );
    return intervalo$;
  }


  //EJ 17-03-2021
  retornaObservable(): Observable<number> {
    let i = -1;
    const obs$ = new Observable<number>(observer => {
      const intervalo = setInterval(() => {
        i++;
        observer.next(i);
        if (i === 4) {
          console.log('if (i === 4)');
          clearInterval(intervalo);
          observer.complete();
        }

        if (i === 2) {
          console.log('if (i === 2)');
          observer.error('i tiene valor = 2');
        }

      }, 1000);
    });
    return obs$;
  }


}
