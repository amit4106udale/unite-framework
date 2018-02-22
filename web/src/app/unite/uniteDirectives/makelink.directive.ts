import { Directive, Input, ElementRef } from '@angular/core';
import { UniteLinkerPipe } from '../pipes/linker.pipe';

@Directive({
  selector: '[uniteLink]'
})
export class UniteLinkDirective {

    @Input('uniteLink') linkConfig;
    @Input() set uniteData(value){
        this.getLink(value);
    };

    constructor( private _elRef : ElementRef, private _uniteLinker : UniteLinkerPipe ) { }

    getLink(uniteData)
    {
        if(this.linkConfig)
        {
            let thisLink = this._uniteLinker.transform(uniteData, this.linkConfig);

            if(thisLink)
            {
                console.log("lksajdfkdsaflksadfsadf", thisLink.replace(/^\/|\/$/g, ''));
                this._elRef.nativeElement.href = thisLink.replace(/^\/|\/$/g, '');
            }
        }
    }
}