import { Component, OnInit } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  constructor(private http: Http) {}
  id: number;
  private headers = new Headers({ 'Content-Type': 'application/json' });
  contacts = [];
  fetchData = function() {
    this.http
      .get('http://localhost:3000/contacts')
      .subscribe((res: Response) => {
        this.contacts = res.json();
      });
  };

  deleteContact = function(id) {
    if (confirm('Are you sure?')) {
      const url = `${'http://localhost:3000/contacts'}/${id}`;
      return this.http
        .delete(url, { headers: this.headers })
        .toPromise()
        .then(() => {
          this.fetchData();
        });
    }
  };

  ngOnInit() {
    this.fetchData();
  }
}
