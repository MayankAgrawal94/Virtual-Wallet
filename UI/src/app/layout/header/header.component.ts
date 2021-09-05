import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WebsiteService } from '../../shared/service/website.service'; 

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
	nav = 1
  constructor(
    private router: Router,
    private webService:WebsiteService,
  ) { }

  ngOnInit() {
    let href = this.router.url;
    if(href == '/wallet'){
      this.nav = 1
    }else if(href == '/transation'){
      this.nav = 2
    }
  }

  navClick(type){
  	this.nav = type
  }

  onLogout(){
    this.webService.onLogout();
  }

}
