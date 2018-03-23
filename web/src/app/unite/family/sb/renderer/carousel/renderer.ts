import { Component, Input } from '@angular/core';

@Component({
    templateUrl : "./renderer.html",
    styleUrls: ['./renderer.css']
})
export class SunbirdCarouselRenderer{
    @Input() data : Array<any>;
    @Input() widgetName;
    @Input() set mapper(value){
        this.mapProperties(this.data, value);
    };

    localData;
    localMap;

    mapProperties(data, mapObj) {
        this.localMap = mapObj;
        this.localData = data;

        console.log("chexkingsadfjlkdsajf ", data);
    }
    slideConfig = {"slidesToShow": 4, "slidesToScroll": 4};
}