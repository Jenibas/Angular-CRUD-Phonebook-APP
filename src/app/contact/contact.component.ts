import { Component, OnInit } from '@angular/core';
import { Http, Response } from '@angular/http';
@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  constructor(private http: Http) {}
  confirmationString: string = 'New Contact has been Added !!';
  isAdded: boolean = false;
  contactObj: object = [];

  addNewContact = function(contact) {
    this.contactObj = {
      id: contact.c_id,
      firstName: contact.c_fname,
      lastName: contact.c_lname,
      phone: contact.c_phone
    };
    this.http
      .post('http://localhost:3000/contacts/', this.contactObj)
      .subscribe((res: Response) => {
        this.isAdded = true;
      });
  };
  ngOnInit() {}
}
