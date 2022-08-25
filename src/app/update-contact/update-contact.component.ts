import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-update-contact',
  templateUrl: './update-contact.component.html',
  styleUrls: ['./update-contact.component.css']
})
export class UpdateContactComponent implements OnInit {
  id: number;
  data: object = {};
  contacts = [];
  exist = false;
  contactObj: object = {};
  private headers = new Headers({ 'Content-Type': 'application/json' });

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: Http
  ) {}
  confirmationString: string = 'Contact details updated successfully !!';
  isUpdated: boolean = false;

  existingContact = function() {
    this.route.params.subscribe(params => {
      this.id = +params['id'];
    });
    this.http
    .get('http://localhost:3000/contacts')
    .subscribe((res: Response) => {
      this.contacts = res.json();
      for (var i = 0; i < this.contacts.length; i++) {
        if (parseInt(this.contacts[i].id) === this.id) {
          this.exist = true;
          this.data = this.contacts[i];
          break;
        } else {
          this.exist = false;
        }
      }
    });
  }
  updateContact = function(contact) {
    this.contactObj = {
      id: contact.c_id,
      firstName: contact.c_fname,
      lastName: contact.c_lname,
      phone: contact.c_phone
    };
    const url = `${'http://localhost:3000/contacts'}/${this.id}`;
    this.isUpdated = true;
    this.http
      .put(url, JSON.stringify(this.contactObj), { headers: this.headers })
      .toPromise()
      .then(() => {
        this.router.navigate(['/']);
      });
  };

  ngOnInit() {
    this.existingContact();
  }
}
