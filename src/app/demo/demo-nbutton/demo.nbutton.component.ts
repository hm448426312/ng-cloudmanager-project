import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-demo-nbutton',
  template: `
    <dc-nbutton [text]="'测试'"></dc-nbutton>
    <dc-nbutton [text]="'搜索'" [icon]="imgSrc"></dc-nbutton>
    <dc-nbutton [text]="'增加'" [icon]="imgSrc2"></dc-nbutton>
  `,
  styles: [`
    dc-nbutton {
      margin: 0 20px;
    }

    :host /deep/ .red {
      background-color: #f00 !important;
    }
  `]
})
export class DemoNButtonComponent implements OnInit {
  imgSrc = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAAAdVBMVEUAAAD////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////li2ZAAAAAJnRSTlMA22og6OOkcfnfv7qylIh6Sxztx6ybmX49NDAl89TSYl5YRCsPA1oVtjUAAACeSURBVBjTbZBXDsQgDEQhPUBIr9vb3P+IGwiiSJkPa3gybkSrER1AqwtxikskWTQzoLLsjft2uAeoYS2E+wN2mKT0KyHXPRATTwNU5B3x9UWzxyLzmXkjCiFlCs4hTLkKfQj1AhMCtuKjZ39a4qae/EEjbKY07HVyDMb9eoytMgtFhpwY1QWuNAVuy55b21qvkQu56oRgG9dLnlCZ/AEG1Qm11McNegAAAABJRU5ErkJggg==';
  imgSrc2 = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAkACQAAD/4QBYRXhpZgAATU0AKgAAAAgABAExAAIAAAARAAAAPlEQAAEAAAABAQAAAFERAAQAAAABAAAAAFESAAQAAAABAAAAAAAAAABBZG9iZSBJbWFnZVJlYWR5AAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAeAB4DASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDxXw54c1PxXrcOk6Tbma5l5JPCxqOrMeyj/wCsMkgV75pn7N2hpZINW1nUZrr+NrTZEg9gGVj+OfwFH7N2l2yeF9W1YR/6VLe/Zi57IiKwA9OXP6eldp4y8ZaaujahYWGpyR6pG4jAjWRGVlkG4BsAdAe9AHm3iv8AZ0W3097nwtqNxPPGpJtL0rmX2VwFAPsRg+orwWaGW3nkgnjeKWNijxupDKwOCCD0INfcmleKdG1u6a206886ZUMhXynXCggZywHcivmv9oDTLbTviV5tumxr6yjuZQOhfc6E/kg/HNAHVfs6eK7S3S/8LXLpFPPN9rtSzY807QrqPcBFOO4z6V7V4p0qfW/Dl3p1s8aTTbNrSEhRh1Y5wD2HpXw3DNLbzRzQyPHLGwdHRiGVhyCCOhFeoaZ+0B4106yS3l/s6/ZOBNdwNvI9yjKD+WaAPqskAEkgAckmvj/4xeKrXxZ8QJ7mwdZLO0iW0hmQ5EoUsSw9tzNj1AB70eKvjF4t8WWDWFzcQWdnIpWWGyjKCUejEktj2zg981wNAH//2Q==';
  constructor() { }

  ngOnInit() { }
}
