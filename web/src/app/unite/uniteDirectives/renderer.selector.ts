import { Directive, ViewContainerRef, Input, ComponentFactoryResolver } from '@angular/core';
import { PlatformLocation } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { GlobalConfig } from '../configs/global.configs';
import { UniteRouting } from '../uniteServices/routingService';
import { dataSources } from '../datasources/sources.collection';
import { HttpClient } from '@angular/common/http';

interface DynamicComponent {
    data: any;
    mapper: any;
    widName: any;
    metadata: any;
  }

@Directive({
  selector: '[ad-renderer]'
})
export class RendererSelector {

    dataCollection = dataSources;

    @Input('ad-renderer') set config(value){
        console.log("I am inside renderer selector config ", value);
        this.renderWidgetsForPage(value);
    }

    constructor(private _vcRef: ViewContainerRef,
                private _cfResolver: ComponentFactoryResolver,
                private _pfLocation : PlatformLocation,
                private _acRoute : ActivatedRoute,
                private _glbConfig : GlobalConfig,
                private _uniteRoute : UniteRouting,
                private _httpClient : HttpClient
                ) { }

    renderWidgetsForPage(availableRenderes){
        let basePath = this._glbConfig.baserUnitePath.basePath;
        let baseFamilypath = this._glbConfig.baserFamilyPath.basePath;

        console.log("chekicng for baseeeeeeeeee pathhhhhhhhh ", basePath, this._pfLocation.pathname);

        let servicePath = this._pfLocation.pathname;
        // servicePath     = basePath
        //                     ? this._pfLocation.pathname.replace(basePath, "").replace(/^\/+|\/+$/g, '')
        //                     : this._pfLocation.pathname.replace(/^\/+|\/+$/g, '');

        // servicePath     = baseFamilypath
        //                     ? servicePath.replace(baseFamilypath, "").replace(/^\/+|\/+$/g, '')
        //                     : servicePath.replace(/^\/+|\/+$/g, '');

        let menuInfo = this._uniteRoute.parseUniteUrl(servicePath);

        console.log("menu informations ", menuInfo);

        if(menuInfo && menuInfo.length !== 0)
        {
            menuInfo.forEach(widInfo => {
                let widRenderer = widInfo['renderer'] ? widInfo['renderer'] : widInfo['defaultRenderer'];
                if(availableRenderes.hasOwnProperty(widRenderer))
                {
                    let componentFactory = this._cfResolver.resolveComponentFactory(availableRenderes[widRenderer]);
                    let thisCompRef = this._vcRef.createComponent(componentFactory);

                    this.loadServiceData(widInfo, thisCompRef);
                }
                else
                {
                    console.log("ERROR :: renderer not found ", widRenderer);
                }
            });
        }
        else
        {
            console.log("invalid menusssss ----------");
        }
    }

    loadServiceData(widInfo, thisCompRef){

        console.log("chekcing wid info000 = ", widInfo);

        if(this.dataCollection.hasOwnProperty(widInfo.source))
        {


            let config = {
                            urlData : widInfo.param,
                            defaultConfig : widInfo['defaultConfig'] ? widInfo['defaultConfig'] : {}
                        };


            let metadata = {
                source : widInfo.source,
                service : widInfo.service,
                config : config
            }

            let dataSourceClass = this.dataCollection[widInfo.source];

            let dataSourceObj   = new dataSourceClass(config, this._httpClient);
            dataSourceObj.getData(widInfo.service).map(data => {
                console.log('Default config ahet.......====',widInfo['defaultConfig']);               
                if(widInfo['defaultConfig']['dataNode'])
                               {
                                  let dataNode2 = widInfo['defaultConfig']['dataNode'].split(".");
                                  let myFinalValue = data;
                                    dataNode2.forEach(element => {
                                            myFinalValue = myFinalValue[element];
                                    });
                                    return myFinalValue;
                                 }
                                return data;
            })
            .subscribe(data =>
            {
                (<DynamicComponent>thisCompRef.instance).data = data;
                (<DynamicComponent>thisCompRef.instance).mapper = widInfo.mapper ? widInfo.mapper: {};
                (<DynamicComponent>thisCompRef.instance).widName = widInfo.widName;
                (<DynamicComponent>thisCompRef.instance).metadata = metadata;
            });
        }
    }
}