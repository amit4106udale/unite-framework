import { Component, OnInit } from '@angular/core';
import { Renderer } from '@unite/core';

@Component({
    templateUrl: './renderer.html'
})
export class NavRenderer implements OnInit, Renderer {
    data;
    mapper;
    widgetName;
    metadata;

    constructor() {

    }

    // Data Manipulation
    ngOnInit() {
        console.log('NAVBAR', this.data);
    }
}
