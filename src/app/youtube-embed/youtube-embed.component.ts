import { Component, Input, OnInit, Sanitizer } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'zornco-youtube-embed',
  templateUrl: './youtube-embed.component.html',
  styleUrls: ['./youtube-embed.component.scss']
})
export class YoutubeEmbedComponent implements OnInit {

  @Input("hash")
  public youtubeHash: string = "";

  constructor(private sanitizer: DomSanitizer) { }

  public get url(): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${this.youtubeHash}`); // dk0CzvgunWE
  }

  ngOnInit(): void {
  }

}
