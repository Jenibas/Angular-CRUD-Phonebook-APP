import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ContactComponent } from './contact.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {RouterTestingModule} from '@angular/router/testing';
import { HttpModule, ResponseOptions } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpResponse } from '@angular/common/http';

describe('ContactComponent', () => {
  let component: ContactComponent;
  let fixture: ComponentFixture<ContactComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactComponent ],
      imports: [ FormsModule, ReactiveFormsModule, HttpModule, HttpClientTestingModule, RouterTestingModule ],
      providers:[
        {provide: MockBackend, useClass: MockBackend}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should create component to add contact details', () => {
    expect(component).toBeTruthy();
  });

  it('should add contact details and return it', inject([MockBackend], (backend: MockBackend) => {
    let res : Response;
    const app = fixture.debugElement.componentInstance;
    backend.connections.subscribe((con:MockConnection)=>{
    let newcontact=new ResponseOptions({
      body:[
        {
        "id":1,
        "firstName":"quess",
        "lastName" : "corp",
        "phone" : 7865432211},
        {
        "id":2,
        "firstName":"swat",
        "lastName" : "nihal",
        "phone" : 7865432211
        }
      ]
    });
    app.addNewContact(newcontact).subscribe(data=>
      expect(data).toEqual(newcontact,'should return contact'),fail);
    
    //should render confirmation message
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h3').textContent).toContain('New Contact has been Added !!');

    const req=httpMock.expectOne('http://localhost:3000/contacts');
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(newcontact);

    const expectedResponse=new HttpResponse({status:201,statusText:'Created',body:newcontact});
    req.event(expectedResponse);
  });
  }));

  it('should return 404 error', inject([MockBackend], (backend: MockBackend) => {
    let res : Response;
    const app = fixture.debugElement.componentInstance;
    backend.connections.subscribe((con:MockConnection)=>{
    let newcontact=new ResponseOptions({
      body:[
        {
        "id":1,
        "firstName":"quess",
        "lastName" : "corp",
        "phone" : 7865432211},
        {
        "id":2,
        "firstName":"swat",
        "lastName" : "nihal",
        "phone" : 7865432211
        }
      ]
    });
    app.addNewContact(newcontact).subscribe(data=>
      expect(data).toEqual(newcontact,'should return contact'),fail);
    
    const req=httpMock.expectOne('http://localhost:3000/contacts');
    const msg='404 error';
    req.flush(msg,{status:201,statusText:'Created'});
  });
}));

});
