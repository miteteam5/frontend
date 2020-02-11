import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  baseurl = environment.baseUrl;
  constructor(private http: HttpClient) { }


  get_academic_years(): Observable<any> {
    let url = `${this.baseurl}academicyear`;
    return this.http.get(url);
  }

  get_term_details(): Observable<any> {
    let url = `${this.baseurl}termNumber`;
    return this.http.get(url)
  }

  get_usn_by_email(email):Observable<any>{
    let url = `${this.baseurl}usn/${email}`;
    return this.http.get(url);
  }
  get_depts(): Observable<any>{
    let url = `${this.baseurl}depts`
    return this.http.get(url)
  }
  get_dept_faculties(dept): Observable<any>{
    let url = `${this.baseurl}emps/${dept}`
    return this.http.get(url)
  }

  get_selected_faculty_details(empid,term):Observable<any>{
    let ur = `${this.baseurl}get-selected-fac-details/${empid}/${term}`;
    return this.http.get(ur);
  }

   getAttendanceDetails(academicYear,usn,termNumber,subject):Observable<any>{
     let url=`${this.baseurl}attendance/${academicYear}/${usn}/${termNumber}/${subject}`
     return this.http.get(url)
   }
  

  get_attendance_details(usn,year,terms):Observable<any>{
    let url = `${this.baseurl}attendancedetails/${usn}/${year}/${terms}`
    return this.http.get(url)

  }
  get_offer_by_usn(term,usn):Observable<any>{
    let ur = `${this.baseurl}get-placement/${term}/${usn}`;
    return this.http.get(ur);
  }
  get_empid(email): Observable<any>{
    let ur = `${this.baseurl}empid/${email}`
    return this.http.get(ur)
  }
  get_single_course(emp , term):Observable<any>{
    let ur = `${this.baseurl}get-single-course/${emp}/${term}`;
    return this.http.get(ur);
  }
  get_emp_placement_of_sub(empid,sem,sub): Observable<any>{
    let ur = `${this.baseurl}emp/placement/${empid}/${sem}/${sub}`
    return this.http.get(ur)
  }
  getNoCourse(empid,sub,term,year):Observable<any>{
    let ur = `${this.baseurl}get_no_course/${empid}/${sub}/${term}/${year}`;
    return this.http.get(ur);
  }
  

}
