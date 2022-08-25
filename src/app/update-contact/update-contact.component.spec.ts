import { async, ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { UpdateContactComponent } from './update-contact.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {RouterTestingModule} from '@angular/router/testing';
import { HttpModule, ResponseOptions, Response } from '@angular/http';
import { MockConnection, MockBackend } from '@angular/http/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('UpdateContactComponent', () => {
  let component: UpdateContactComponent;
  let fixture: ComponentFixture<UpdateContactComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateContactComponent ],
      imports: [ FormsModule, ReactiveFormsModule, HttpModule, HttpClientTestingModule, RouterTestingModule ],
      providers:[
        {provide: MockBackend, useClass: MockBackend}
      ]    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

    it('should validate URL', inject([MockBackend], (backend: MockBackend) => { 
      backend.connections.subscribe((con:MockConnection)=>{
        expect(con.request.url).toBe('http://localhost:3000/contacts');
        let body=con.request.json();
        expect(body.data).toEqual('contact');
      });
    }));
  
    it('should return existing contact detail', inject([MockBackend], (backend: MockBackend) => {
      let res : Response;
      let id:2;
      const app = fixture.debugElement.componentInstance;
      app.existingContact();
      expect(app.contacts).toBeDefined();
      backend.connections.subscribe((con:MockConnection)=>{
      expect(con.request.url).toBe('http://localhost:3000/contacts/'+id);
      let response=new ResponseOptions({
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
      app.updateContact(id).subscribe((response)=>{
        res=response;
      });
      tick();
      expect(res[2].id).toBeDefined();
      expect(res[2].firstName).toBe('swat');
      const req=httpMock.expectOne('http://localhost:3000/contacts');
      expect(req.request.method).toEqual('GET');
    });
  }));
    
    it('should update a contact detail', inject([MockBackend], (backend: MockBackend) => {
      let res : Response;
      let id:1;
      const app = fixture.debugElement.componentInstance;
      app.existingContact();
      expect(app.contacts).toBeDefined();
      backend.connections.subscribe((con:MockConnection)=>{
      expect(con.request.url).toBe('http://localhost:3000/contacts/'+id);
      let response=new ResponseOptions({
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
      var contact=res[0];
      contact.firstName="city";
      app.updateContact(id).subscribe((response)=>{
        res=response;
      });
      tick();
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelector('h3').textContent).toContain('Contact details updated successfully !!');
      expect(res[1].id).toBeDefined();
      expect(res[1].firstName).toBe('city');
      const req=httpMock.expectOne('http://localhost:3000/contacts');
      expect(req.request.method).toEqual('PUT');
    });

  }));
  
});
