import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

function emailMatcher(c: AbstractControl): { [key: string]: boolean } | null {
  const emailControl = c.get('email');
  const confirmControl = c.get('confirmEmail');

  if (emailControl.pristine || confirmControl.pristine) {
    return null;
  }

  if (emailControl.value === confirmControl.value) {
    return null;
  }
  return { match: true };
}

@Component({
  selector: 'app-person-form',
  templateUrl: './person-form.component.html',
  styleUrls: ['./person-form.component.scss']
})
export class PersonFormComponent implements OnInit {

  constructor(private formBuilder:FormBuilder) { }
  public personForm :FormGroup;
  ngOnInit(): void {
    this.personForm=  this.formBuilder.group({
      fName: ['', [Validators.required, Validators.minLength(3)]],
      age: ['', [Validators.min(0)]],
      emailGroup:this.formBuilder.group({
        email:['',[Validators.required,Validators.email]],
        confirmEmail:['',[Validators.required,Validators.email]]
      }, { validator: emailMatcher })
    })
  }

  save(){
    console.log(this.personForm.value)
  }

}
