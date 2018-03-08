import { Injectable } from "@angular/core";
//import { Observable } from "rxjs/Observable";
import { GlobalConfig } from '../configs/global.configs';
import { Menues } from '../configs/menus.configs';
import { Widgets } from '../configs/widgets.config';
import { MenusService } from "../services/menus.service";

@Injectable()
export class UniteRouting{

    menus;
    finalMenus;

    constructor(private _gbConfig: GlobalConfig, private _menu: Menues, private _widget: Widgets, private _menusService: MenusService ){
    }

    getMenus(dataSources){
        this._menusService.getMenus().subscribe(data =>{
        // this._menu.getMenus().subscribe(data =>{
            this.menus = data;
            let finalMenu = [];
            console.log("datadddddddddddd");
            console.log(data);
            this.menus.forEach(menu => {
                let menuArray = {};
                console.log(menu['routeUrl']);
                menuArray['path'] = menu['routeUrl'];
                menuArray['page_id'] = menu['id'];
                menuArray['menuName'] = menu['name'];
                finalMenu.push(menuArray);
            });

            this.finalMenus = finalMenu;
            console.log("finalMenus");
            console.log(this.finalMenus);
            this.getAllWidgets();
        });
    }

    createDynamicMenus(dataSources)
    {
        let finalMenu = [];

        this.menus.forEach(menuElement => {

            if(dataSources.hasOwnProperty(menuElement.dataSource))
            {
                let dsName = dataSources[menuElement.dataSource];
                let dsObj  = new dsName;
                let dsRoutes = dsObj.setRoutes("");

                dsRoutes.forEach(roElement => {
                    
                    let finalDsRoute = {};

                    let pathStr = roElement.path;

                    finalDsRoute['path'] = roElement['path'] && roElement['path'] !== ""
                                            ? "/" + menuElement.alias + "/" + roElement.path
                                            : "/" + menuElement.alias ;
                    finalDsRoute['page_id'] = roElement['id'];
                    //finalDsRoute['service'] = roElement.service;
                    //finalDsRoute['defaultRenderer'] = roElement.renderer;
                    //finalDsRoute['source'] = menuElement.dataSource;
                    //finalDsRoute['widgets'] = roElement.widgets;
                    //finalDsRoute['showDefault'] = roElement.hasOwnProperty('showDefault')
                    //                            ? (roElement['showDefault'] ? true : false) 
                    //                            : true;
                    //finalDsRoute['mapper'] = roElement['mapper'];
                    finalDsRoute['menuName'] = roElement['title'];

                    console.log("findsroute -=-=-=-=--=-=-", finalDsRoute);

                    finalMenu.push(finalDsRoute);
                });
            }
        });
        console.log("finalMenu");
        console.log(finalMenu);
        this.finalMenus = finalMenu;
        console.log("This are the final dymaic menus ==== ", this.finalMenus);
        this.getAllWidgets();
        //console.log('Let Wale Widgets', widgets);
    }

    parseUniteUrl(uniteUrl)
    {
        console.log("parse unite url 1 ", uniteUrl, this.finalMenus);
        if(uniteUrl)
        {
            let segArr = uniteUrl.split('/');
            let segCount = segArr.length;
            let respObj = {};
            let mainDynamicSegObj = {};

            for(let roElement of this.finalMenus)
            {
                let roArray = roElement.path.split("/");
                let roLength = roArray.length;
                let roDynamicSegmentCount   = (roElement.path.match(/\/:/g)||[]).length;
                let roStaticSegmentCount    = roLength - roDynamicSegmentCount;
                let dynamicSegObj = {};

                let segmentDetails = [];

                if(segCount === roLength)
                {
                    let valid = true;
                    let index = 0;
                    for(let roSegments of roArray) {
                        let segment = {};
                        segment['position'] = index;
                        segment['static']   = roSegments.indexOf(":") === 0 ? false : true;
                        segment['dynamic']  = !segment['static'];
                        segment['dynamicName'] = segment['dynamic'] ? roSegments.substr(1) : "";

                        if(segment['static'])
                        {
                            if(roSegments !== segArr[index])
                            {
                                valid = false;
                                break;
                            }
                        }
                        else
                        {
                            dynamicSegObj[segment['dynamicName']] = segArr[index];
                        }
                        index++;
                    };

                    if(valid)
                    {
                        respObj =  {
                                    source : roElement['source'],
                                    service : roElement['service'],
                                    defaultRenderer : roElement['defaultRenderer'],
                                    widgets : roElement['widgets'],
                                    param : dynamicSegObj,
                                    showDefault : roElement['showDefault'],
                                    mapper : roElement['mapper'],
                                    widName : roElement['menuName']
                                };

                        mainDynamicSegObj = dynamicSegObj;
                        break;
                    }
                }
            };

            if (respObj && respObj.hasOwnProperty('widgets') && respObj['widgets'] !== undefined)
            {
                let tempRtrn = [];
                let tempRespObj = respObj;
                let tempWidgets = respObj['widgets']

                delete tempRespObj["widgets"];

                if(respObj.hasOwnProperty('showDefault') && respObj['showDefault'])
                {
                    tempRtrn.push(tempRespObj);
                }

                tempWidgets.forEach(element => {
                    element['param'] = mainDynamicSegObj
                    tempRtrn.push(element);
                });

                return tempRtrn;
            }

            return [respObj];
        }
    }

    getAllMenus()
    {
        let finalUniteBasePath = "";
        let menusToReturn = [];
        let finalMenus = this.finalMenus;

        finalUniteBasePath += this._gbConfig.baserUnitePath['basePath'] ? this._gbConfig.baserUnitePath.basePath + "/" : "";
        finalUniteBasePath += this._gbConfig.baserFamilyPath['basePath'] ? this._gbConfig.baserFamilyPath.basePath + "/" : '';

        finalMenus.forEach(element => {
            let thisElement = element;
            if(thisElement.path.indexOf(':') == -1)
            {
                thisElement.path = finalUniteBasePath + thisElement.path;
                menusToReturn.push(thisElement);
            }
        });

        return menusToReturn;

    }

    getAllWidgets()
    {
        this._widget.getWidgets().subscribe(data =>{
            console.log("getWidgets");
            console.log(data);
            this.mapWidgetsWithPages(data);
        });
    }

    mapWidgetsWithPages(widgets)
    {
        this.finalMenus.forEach((menuElement, index) => {    
            if(menuElement.page_id) {
                let widgetsArray = [];
                widgets.forEach(widget => {
                    if (menuElement.page_id == widget.page_id) {
                        widgetsArray.push(widget);
                    }
                });
                
                this.finalMenus[index]['widgets']= widgetsArray;
            }
        });
        console.log('Final Menues After Mapping',this.finalMenus);
    }
}