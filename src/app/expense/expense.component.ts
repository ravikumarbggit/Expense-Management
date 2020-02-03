import { Component, OnInit, OnChanges, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Location } from '@angular/common';
import { Expense } from '../data-model/expense.model';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ExpenseDataService } from '../service/expense-data.service';
import { MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { User } from '../data-model/user.model';
import { UsersService } from '../service/users.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Plugins, CameraResultType, CameraSource } from '@capacitor/core';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpenseComponent implements OnInit, OnDestroy {

  public expenseForm: FormGroup
  datePipe = new DatePipe('en-US');
  maxDate: Date = new Date();
  //defaultCurrency: string = "INR";
  currencies = [{
    symbol: "₹",
    text: "INR"
  },
  {
    symbol: "$",
    text: "USD"
  },
  {
    symbol: "A$",
    text: "AUD"
  },
  {
    symbol: "S$",
    text: "SGD"
  },
  {
    symbol: "£",
    text: "GBP"
  },
  {
    symbol: "€",
    text: "GBP"
  },
  {
    symbol: "¥",
    text: "CNY"
  },
  {
    symbol: "¥",
    text: "JPY"
  }];
  expenseCategories: string[] = ["Personal", "Business", "Miscellaneous"];
  expenseHeads: string[] = ["Taxi", "Flight", "Meals", "Shopping"];
  expenses: Expense[] = [];
  onDestroy: Subject<boolean> = new Subject();
  private paramSub: Subscription;
  currentUser: User;
  imagePreview: ImagePreview;
  image: SafeResourceUrl;

  amountTickInterval: number = 5;
  amountThumbLabel: boolean = false;
  stepAmount: number = 500;
  minAmount: number = 0;
  maxAmount: number = 10000;
  amountSlider = new FormControl('');
  isWeb: boolean = true;

  constructor(private fb: FormBuilder
    , private expenseDataService: ExpenseDataService
    , public snackBar: MatSnackBar
    , private route: ActivatedRoute
    , private userService: UsersService
    , public sanitizer: DomSanitizer
    , private _location: Location
    , private authService: AuthService) { }

  ngOnInit() {

    this.currentUser = this.userService.getCurrentUser();
    this.getExpenses();


    console.log('this.currentUser: ', this.currentUser);

    this.authService.getDeviceInfo()
    .then(deviceInfo => {
      console.log('deviceInfo: ',deviceInfo)
      if(deviceInfo.platform === 'web'){
        this.isWeb = true;
      }
      else{
        this.isWeb = false;
      }
    });
    
  }

  watchAmountSlider(){
    this.amountSlider.valueChanges
    .subscribe(response => {
      this.expenseForm.get('amount').patchValue(response, {emitEvent: false});
    });

    this.expenseForm.get('amount').valueChanges.subscribe(result => {

      if(result > this.maxAmount){
        this.expenseForm.get('amount').patchValue(this.maxAmount, {emitEvent: false});
        result = this.maxAmount;
      }
      this.amountSlider.patchValue(result, {emitEvent: false});
    })

  }

  ngOnDestroy() {
    console.log('ngOnDestory');
    this.onDestroy.next(true);
    this.onDestroy.complete();
    this.paramSub.unsubscribe();
  }

  initForm() {

    let data: Expense = {
      id: null,
      userId: null,
      date: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
      expenseHead: null,
      amount: null,
      currency: this.currentUser ? this.currentUser.currency : null,
      expenseCategory: null,
      isRecurring: null,
      isSelected: null,
      details: null,
    }

    this.expenseForm = this.toFormGroup(data);

    this.watchAmountSlider();
  }

  toFormGroup(data: Expense): FormGroup {

    const formGroup = this.fb.group({
      id: [data.id],
      userId: [data.userId],
      date: [this.datePipe.transform(data.date, 'yyyy-MM-dd'), Validators.required],
      expenseHead: [data.expenseHead, Validators.required],
      amount: [data.amount, [Validators.required, Validators.pattern(/^[.\d]+$/)]],
      currency: [data.currency, Validators.required],
      expenseCategory: [data.expenseCategory, Validators.required],
      isRecurring: [data.isRecurring],
      details: [data.details]
    });

    return formGroup;

  }

  getExpenses() {
    this.expenseDataService.getExpenses()
      .subscribe(response => {
        this.expenses = response;
        if (this.expenses)
          this.getExpenseDetail();
      })
  }

  onSubmit(model: Expense) {

    if (this.expenseForm.valid) {

      if (!model.id) {
        let id: number = this.expenses.length > 0 ? Math.max.apply(Math, this.expenses.map(function (o) { return o.id; })) + 1 : 1;
        model.id = id;
      }

      console.log("in submit: ", model)

      if (this.expenses.find(exp => exp.id === model.id)) {
        this.expenses.forEach(exp => {
          if (exp.id === model.id) {
            exp.amount = model.amount;
            exp.currency = model.currency;
            exp.date = this.datePipe.transform(model.date, 'yyyy-MM-dd');
            exp.details = model.details;
            exp.expenseCategory = model.expenseCategory;
            exp.expenseHead = model.expenseHead;
            exp.isRecurring = model.isRecurring;
            exp.isSelected = model.isSelected;
          }
        })
      } else {
        this.expenses.push(model)
      }


      this.expenseDataService.pushExpenses(this.expenses);

      let snackBarRef = this.snackBar.open("Saved!", "x", {
        duration: 5000,
      });

      // this.router.navigate(['/']);
      this.goBack();

    } else {
      console.log("Form not vaid");
    }
  }

  getExpenseDetail() {
    this.paramSub = this.route.params
      .pipe(
        takeUntil(this.onDestroy)
      )
      .subscribe(params => {
        // console.log("params['id']: " + params['id']);
        if (params['id']) {
          let expenseFromRoute: Expense = this.expenses.find(exp => exp.id === +params['id']);
          console.log("expenseFromRoute: ", expenseFromRoute);
          if (expenseFromRoute){
            this.expenseForm = this.toFormGroup(expenseFromRoute);
            this.amountSlider.patchValue(expenseFromRoute.amount, {emitEvent: false});
            this.watchAmountSlider();
          }
        }
        else {
          this.initForm();
        }

      });

  }

  reset(){
    this.amountSlider.patchValue(0, {emitEvent: false});
    this.deletePreviewPhoto();
    this.initForm();
  }

  onImageChange(event) {
    // this.isImageUploadProgress = true;

    // setTimeout(() => {
    if (event.target.files && event.target.files[0]) {
      // let image = event.target.files[0];



      // let uploadedImage: File = new File(image, "name");


      // this.getImagePreview("name", uploadedImage);

      const file = event.target.files[0];

      const reader = new FileReader();
      reader.onload = e => this.imagePreview = { name: name, image: reader.result as string };

      reader.readAsDataURL(file);

    }



  }


  // getImagePreview(name: string, file: File) {
  //   console.log('1: ', name)
  //   const reader: FileReader = new FileReader();
  //   console.log('2');
  //   reader.readAsDataURL(file);
  //   console.log('3')
  //   reader.onload = () => {
  //     this.imagePreview = { name: name, image: reader.result as string };
  //     console.log('4: ')
  //   };
  // }

  goBack(){
    this._location.back();
  }


  deletePreviewPhoto() {
    this.imagePreview = undefined;
  }


  async takePicture() {
    const { Camera } = Plugins;

    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Prompt
    });

    // Example of using the Base64 return type. It's recommended to use CameraResultType.Uri
    // instead for performance reasons when showing large, or a large amount of images.
    this.image = this.sanitizer.bypassSecurityTrustResourceUrl(image && (image.base64Data));
  }

  deleteImage(){
    this.image = undefined;
  }

}


export interface ImagePreview {
  name: string;
  image: string;
}