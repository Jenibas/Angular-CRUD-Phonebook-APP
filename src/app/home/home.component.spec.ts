import { async, ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';
import { HttpModule, Http, ResponseOptions, Response } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let httpMock: HttpTestingController;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeComponent ],
      imports: [ FormsModule, ReactiveFormsModule, HttpModule, HttpClientTestingModule, RouterTestingModule ],
      providers:[
        {provide: MockBackend, useClass: MockBackend}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check header details', inject([MockBackend], fakeAsync((backend: MockBackend) => { 
    backend.connections.subscribe((con:MockConnection)=>{
      let contentType = con.request.headers.get('Content-Type');
      expect(contentType).not.toBeNull();
      expect(contentType).toEqual('application/json');
      expect(con.request.url).toBe('...');
      let body=con.request.json();
      expect(body.data).toEqual('contact');
    });
  })));

  it('should check URL', inject([MockBackend], (backend: MockBackend) => { 
    backend.connections.subscribe((con:MockConnection)=>{
      expect(con.request.url).toBe('http://localhost:3000/contacts');
      let body=con.request.json();
      expect(body.data).toEqual('contact');
    });
  }));

  it('should fetch data', inject([MockBackend], (backend: MockBackend) => {
    let res : Response;
    const app = fixture.debugElement.componentInstance;
    app.fetchData();
    expect(app.contacts).toBeDefined();
    backend.connections.subscribe((con:MockConnection)=>{
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
    con.mockRespond(new Response(response));
    const req=httpMock.expectOne('http://localhost:3000/contacts');
    expect(req.request.method).toEqual('GET');
  });
  }));

  it('should delete contact', inject([MockBackend], (backend: MockBackend) => {
    let res;
    let id: 2;
    const app = fixture.debugElement.componentInstance;
    app.fetchData();
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
    app.deleteContact(id).subscribe((response)=>{
      res=response;
    });
    tick();
    expect(res[2].id).toBeUndefined();
    const req=httpMock.expectOne('http://localhost:3000/contacts');
    expect(req.request.method).toEqual('DELETE');
  });
  }));

});
