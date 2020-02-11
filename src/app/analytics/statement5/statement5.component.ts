import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from '../analytics.service';
import { AuthService } from 'src/app/auth/auth.service';
import { GoogleChartInterface } from 'ng2-google-charts/google-charts-interfaces';
import { ChartSelectEvent } from 'ng2-google-charts';
import { VirtualTimeScheduler } from 'rxjs';


@Component({
  selector: 'app-statement5',
  templateUrl: './statement5.component.html',
  styleUrls: ['./statement5.component.css']
})
export class Statement5Component implements OnInit {
  // Array Declaration
  academicYears: string[] = [];
  termnumbers: [] = [];
  attendance_details = [];
  placement_offers:any[] = [];
  user_role:string[] =[];
  faculty_role:string[] = ["FACULTY" ];
  faculty_roles:string[] = ["FACULTY" , "COUNSELLOR"];
  hod_role:string[] = ["FACULTY" , "DEPT_ADMIN" , "HOD"];
  principal_role:string[] = ["FACULTY" , "COLLEGE_ADMIN" , "PRINCIPAL"];
  student_role:string[] = ["STUDENT"];
  fac_attend_details:any[] = [];
  faculty_names:any[] =[];
  dept_names:any[] = [];
  //Chart Declarations
  public firstLevelChart: GoogleChartInterface;
  public faculty_chart:GoogleChartInterface;
  //string declarations
  title: string;
  error_message: string
  error_message1: string
  single_course_name :string;
  //boolean Declarations
  error_flag = false;
  
  chart_visibility = false;
  fac_chart_visibility = false;
  showSpinner = false;
  facSpinner = false;
  placement_status_displayed = false;
  logged_hod = false;
  logged_faculty = false;
  logged_student = false;
  logged_princi = false;
  //data type declaration
  terms;
  selectedyear;
  user_info;
  course_name;
  total_present;
  total_class;
  faculty_id;
  dept_name:any;
  selectedSubject;
  princi_Department;
  hide_details_princi = false;
  attDetails:any[];
  placementDetails : any[];
  current_faculty;
  course_modal;
  placed_modal;
  total_stu_modal;
  total_pos_modal;
  no_cls_conducted;

  constructor(private analyticsService: AnalyticsService, private authService: AuthService) { }

  ngOnInit() {
    let u_info = localStorage.getItem('user');
    let u = JSON.parse(u_info);
    console.log(u);
    this.faculty_id = u['employeeGivenId'];
    this.user_role = u['roles'];
    if (JSON.stringify(this.user_role) == JSON.stringify(this.hod_role))
    {
      this.logged_hod = true;
    }
    else if (JSON.stringify(this.user_role) == JSON.stringify(this.faculty_role) || JSON.stringify(this.user_role) == JSON.stringify(this.faculty_roles))
    {
      this.logged_faculty = true;
    }
    else if (JSON.stringify(this.user_role) == JSON.stringify(this.student_role))
    {
      this.logged_student = true;
    }
    else if(JSON.stringify(this.user_role) == JSON.stringify(this.principal_role))
    {
      this.logged_princi = true;
    }
    this.user_info = this.authService.getUserInfo()
    this.get_academic_years()
    this.get_term_numbers()
    this.analyticsService.get_depts().subscribe(res=>{
      let re = res['depts'];
      for(let r of re)
      {
        this.dept_names.push(r)
      }
    })
  }

  get_academic_years() {
    this.analyticsService.get_academic_years().subscribe(res => {
      this.academicYears = res['academicYear']
    })
  }

  get_term_numbers() {
    this.analyticsService.get_term_details().subscribe(res => {
      this.termnumbers = res['term_numbers']
    }
    )
  }

  studentsearch() {
    if (!this.placement_status_displayed) {
      this.getPlacementDetails()
    }
    else{
      this.error_flag = true
      this.error_message1 = "Not placed yet..."
      
    }
    this.showSpinner = true;
    this.analyticsService.get_attendance_details(this.user_info['usn'], this.selectedyear, this.terms).subscribe(res => {
      this.attendance_details = res['attendance_percent']
      this.attendace_data(this.attendance_details)
    })
    
  }

  getPlacementDetails() {
    this.placement_status_displayed = true;
    this.analyticsService.get_offer_by_usn(this.selectedyear, this.user_info['usn']).subscribe(res => {
      let re = res["offers"];
      for (let r of re) {
        this.placement_offers.push([r['companyName'], r['salary']])
      }
    })
  }

  attendace_data(data) {
    let dataTable = []
    dataTable.push([
      "CourseName",
      "Attendance %", { type: 'string', role: 'tooltip' }
    ]);

    for (let i = 0; i < data.length; i += 1) {
      dataTable.push([data[i]['courseName'],
      data[i]['attendance_per'], "Attendance % : " + data[i]['attendance_per']])
    }

    if (dataTable.length > 1) {
      this.chart_visibility = true
      this.error_flag = false
      this.graph_data(dataTable)
    }
    else {
      this.showSpinner = false;
      this.error_flag = true
      this.error_message = "Data does not exist"
    }
  }

  back_() {
    this.chart_visibility = false
  }


  graph_data(data) {
    this.showSpinner = false
    this.title = ' Attendance %',
      this.firstLevelChart = {
        chartType: "ColumnChart",
        dataTable: data,
        options: {
          bar: { groupWidth: "10%" },
          vAxis: {
            title: "Percentage",
            viewWindow: {
              max:100,
              min:0
          }
          },

          height: 800,
          hAxis: {
            title: "Courses",
            titleTextStyle: {
            }
          },
          chartArea: {
            left: 80,
            right: 100,
            top: 100,
          },
          legend: {
            position: "top",
            alignment: "end"
          },
          seriesType: "bars",
          colors: ["#2ebf91"],
          fontName: "Times New Roman",
          fontSize: 13,

        }

      }
  }
  second_level(event: ChartSelectEvent) {
    this.selectedSubject = event.selectedRowValues[0]
    this.analyticsService.getAttendanceDetails(this.selectedyear,this.user_info['usn'],this.terms,this.selectedSubject).subscribe(res=>{
      let allAttendance=res["attendance_d"]
      let data1=[]
      for( let att of allAttendance){
        data1.push([att["courseName"],att["total_classes"],att["present"]])
      }
      this.attDetails=data1
      console.log(this.attDetails)
    })
  }

  // Faculty Module

  draw_faculty_chart(data)
  {
    this.facSpinner =true;
   
    this.title = 'Course-wise Attendance %',
    this.faculty_chart = {
      chartType: "ComboChart",
      dataTable: data,
      options: {
        bar: { groupWidth: "10%" },
        vAxis: {
          title: "Percentage",
         
          viewWindow: {
            max:100,
            min:0
        }
        },

        height: 800,
        hAxis: {
          title: "Courses",
          titleTextStyle: {
          }
        },
        chartArea: {
          left: 80,
          right: 100,
          top: 100,
        },
        legend: {
          position: "top",
          alignment: "end"
        },
        seriesType: "bars",
        colors: ["#2ebf91","#d3ad5d"],
        fontName: "Times New Roman",
        fontSize: 13,

      }

    }
  }
  faculty_level(event: ChartSelectEvent) {
    let subcode = event.selectedRowFormattedValues[0];
    this.analyticsService.get_emp_placement_of_sub(this.current_faculty,this.terms,subcode).subscribe(res=>{
      let re = res
      this.course_modal = re['courseCode'];
      this.total_stu_modal = re['totalStudents'];
      this.placed_modal = re['placedStudents'];
      this.total_pos_modal = re['totalPositions'];
      
    })
    this.analyticsService.getNoCourse(this.current_faculty,subcode,this.terms,this.selectedyear).subscribe(res=>{
      let r=res["course"][0]
      this.no_cls_conducted=r['classes']
    })
  }

  facultysearch()
  {
    this.current_faculty = this.faculty_id;
    this.analyticsService.get_selected_faculty_details(this.faculty_id,this.terms).subscribe(res =>{
      let re = res["fac"];
      
      let db = [];
      db.push(["Course Name","Attendance Percent","placePercentage"])
      for(let r of re)
      {
        db.push([r['courseid'],r['totalPercentage'],r['placePercentage']])
      }
      if (db.length > 1) {
        this.fac_chart_visibility = true
        this.error_flag = false
        this.draw_faculty_chart(db)
      }
      else {
        this.showSpinner = false;
        this.error_flag = true
        this.error_message = "Data does not exist"
      }
    })
  }


  getFacultyDetails(fac_id)
  {
    

    this.current_faculty = fac_id
    this.analyticsService.get_selected_faculty_details(fac_id,this.terms).subscribe(res =>{
      let re = res["fac"];
      let db = [];
      db.push(["Course Name","Attendance Percent","Placement Percentage"])
      for(let r of re)
      {
        db.push([r['courseid'],r['totalPercentage'],r['placePercentage']])
      }
      if (db.length > 1) {
        this.fac_chart_visibility = true
        this.error_flag = false
        this.draw_faculty_chart(db)
      }
      else {
        this.showSpinner = false;
        this.error_flag = true
        this.error_message = "Data does not exist"
      }
    })
    
  }
  // HOD MODULE

  hodsearch()
  {
    this.faculty_names = [];
    this.get_faculty_details();
  }

  get_faculty_details() {
    let us = localStorage.getItem('user');
    let u = JSON.parse(us);
    let arr = u['employeeGivenId'];
    let patt = new RegExp("[a-zA-z]*");
    let res = patt.exec(arr);
    this.dept_name =res[0];
    this.analyticsService.get_dept_faculties(this.dept_name).subscribe(res => {
      let na = res['faculty'];
      for (let n of na) {
        this.faculty_names.push([n['employeeGivenId'],n['name'].toUpperCase()]);
      }
      console.log("selected ",this.academicYears,this.terms);
    })
  }


  //principal

  princisearch()
  {
    this.faculty_names = [];
    this.get_faculty_details1();
  }

  get_faculty_details1() {
    this.analyticsService.get_dept_faculties(this.princi_Department).subscribe(res => {
      let na = res['faculty'];
      for (let n of na) {
        this.faculty_names.push([n['employeeGivenId'],n['name'].toUpperCase()]);
      }
      this.hide_details_princi = true;
    })
  }
}