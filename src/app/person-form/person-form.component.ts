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
  emailMessage: string;
  private validationMessages={
  required:'the field is required',
  email:'enter a valid email'
}

  constructor(private formBuilder:FormBuilder) { }
  public personForm :FormGroup;

  ngOnInit(): void {
    this.personForm=  this.formBuilder.group({
      fName: ['', [Validators.required, Validators.minLength(3)]],
      age: ['', [Validators.min(0)]],
      notification: [''],
      emailGroup:this.formBuilder.group({
        email:['',[Validators.email]],
        confirmEmail:['',[Validators.email]]
      }, { validator: emailMatcher }),
    
    })

    this.personForm.get('notification').valueChanges.subscribe(
      res =>{
        console.log(res)
        this.setNotification(res)
      }
    )


    const emailControl = this.personForm.get('emailGroup.email');
    emailControl.valueChanges.pipe(
      // debounceTime(1000)
    ).subscribe(
      value => this.setMessage(emailControl)
    );

  }
  setNotification(val:string){
    if (val == 'email'){
      this.personForm.get('emailGroup.email').setValidators(Validators.required)
    }
    else{
      this.personForm.get('emailGroup.email').clearValidators()
    }
    this.personForm.get('emailGroup.email').updateValueAndValidity()
  }

  makeemailRequired(){
    this.personForm.get('emailGroup.email').setValidators(Validators.required);
    this.personForm.get('emailGroup.email').updateValueAndValidity()
  }



  setMessage(c: AbstractControl): void {
    this.emailMessage = '';
    if ((c.touched || c.dirty) && c.errors) {
      this.emailMessage = Object.keys(c.errors).map(
        key => this.validationMessages[key]).join(' ');
    }
  }


  save(){
    console.log(this.personForm.value)
  }




}
