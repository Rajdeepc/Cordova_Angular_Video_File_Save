import { Component } from '@angular/core';
import { saveAs } from "file-saver";
import { HttpClient } from "@angular/common/http";
import { HttpHeaders } from "@angular/common/http";
import * as CryptoJS from "crypto-js";
import { EmbedVideoService } from "ngx-embed-video";
import { DomSanitizer } from "@angular/platform-browser";
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  public videoArray = [
    'http://static.videogular.com/assets/videos/videogular.mp4',
    'http://static.videogular.com/assets/videos/videogular.mp4',
    'http://static.videogular.com/assets/videos/videogular.mp4',
    'http://techslides.com/demos/sample-videos/small.mp4',
   
  ]

  public newArray = [];
  public videoArrayToMap = [];
  public showSaveVideosContainer:Boolean;
  safeUrl: any;
  public myPassword = "myPassword";
  constructor(
    private http: HttpClient,
    private embedService: EmbedVideoService,
    private sanitizer: DomSanitizer
  ) {
    this.sanitizer = sanitizer;
    this.showSaveVideosContainer = false;
  }

  
  getArrayUrlSanitized() {
    let itemsToGetfromStorageArray = [];
    this.videoArray.map((item) => {
      let sanitizedHtml = this.sanitizer.bypassSecurityTrustResourceUrl(item);
      itemsToGetfromStorageArray.push(sanitizedHtml);
    });
    return itemsToGetfromStorageArray; // returns an array of elements
  }

  getTrustedUrl(url:any) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  clearLocalStorage() {
    localStorage.clear();
  }

  deleteFromStorage(item:any){
    const removeSafeParam = item.changingThisBreaksApplicationSecurity.changingThisBreaksApplicationSecurity;
    let itemToDelete = this.fileNameExtract(removeSafeParam);
    localStorage.removeItem(itemToDelete);
    this.getLocalSotrageItems();
    location.reload();
  }

  ngOnInit() {
    this.newArray = this.getLocalSotrageItems();
    this.videoArrayToMap = this.getArrayUrlSanitized();
    if(this.newArray.length > 0){
      this.showSaveVideosContainer = true;
    }
  }

  getLocalSotrageItems() {
    const items = { ...localStorage };
    let itemsToGetfromStorage = [];
    for (var key in items) {
      let parsedValue = JSON.parse(items[key]);
      let sanitizedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(parsedValue);
      //parse the value
      itemsToGetfromStorage.push(sanitizedUrl);
    }
    return itemsToGetfromStorage; // returns an array of elements
  }

  fileNameExtract(urlToDownload){
    const filename = urlToDownload.substring(urlToDownload.lastIndexOf("/") + 1);
    const nameOfString = filename.substring(0, filename.indexOf("."));
    return nameOfString;
  }

  leadGenSubmit(urlToDownload) {
    let headers = new HttpHeaders();
    let reader = new FileReader();
    headers = headers.set("Accept", "video/mp4");
    let url = urlToDownload.changingThisBreaksApplicationSecurity.changingThisBreaksApplicationSecurity;
    let nameOfStringToAppend = this.fileNameExtract(url);
    return this.http
      .get(url, { headers: headers, responseType: "blob" })
      .subscribe(
        data => {
          console.log(data);
          var blob = new Blob([data], { type: "video/mp4" });
          var encrypted = CryptoJS.AES.encrypt(reader.result, this.myPassword);
          console.log("Encrypted" + encrypted);
          reader.readAsDataURL(blob);
          saveAs(blob, this.fileNameExtract(url));
          localStorage.setItem(nameOfStringToAppend,  JSON.stringify(url));
        },
        err => {
          console.log(err);
        }
      );
  }
}
