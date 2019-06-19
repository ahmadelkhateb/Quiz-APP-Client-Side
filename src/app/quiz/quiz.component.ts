import { Question } from './../question/question.model';
import { Quiz } from './quiz.model';
import { NgForm } from '@angular/forms';
import { QuestionService } from './../sharedServices/question.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { QuizService } from '../sharedServices/quiz.service';
import { UserService } from '../user/user.service';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit {
  quiz_id;
  quiz: Quiz = new Quiz();
  quiz_questions: Question[];
  answerTitle;
  is_correct;
  errMsg;
  canPublish= new Array();
  index=1;
  constructor(private router: Router,private userService: UserService, private route: ActivatedRoute, private quizService: QuizService, private questionService: QuestionService) { }

  getQuiz() {
    this.quizService.findQuiz(this.quiz_id).subscribe(res => {
      this.quiz = res
      console.log(res)
    },
    err => {
      this.errMsg = err.error.message;      
    })
  }
  getQuestions() {
    this.questionService.getQuizQuestions(this.quiz_id).subscribe(res => {
      this.quiz_questions = res
      console.log(res)
    },
    err => {
      this.router.navigate(["**"])
      this.errMsg = err.error.message;      
    })
  }

  onSubmit(form: NgForm) {
    this.errMsg = ""
    this.questionService.addQuestion(form.value).subscribe(res=>{
      this.getQuestions();
    },
    err => {
      if(err.status == 409) {
        this.errMsg = err.error.message
      }
      else{
        console.log(err)
        this.errMsg = err.error;
      }
    }) 
  }

  questionhasCorrect(question:Question) {
    this.questionService.hasCorrectAnswer(question._id).subscribe((res) => {
      this.canPublish.push(res)
    }, 
      err => {
        console.log(err)
      }
    )
  }

  publish() {
    let sure = confirm('Once You publish This Quiz You Will not be able to Edit it\nDo you want to publish ?')
    if(sure){
      // this.quiz_questions.forEach( (question) => {
      //     this.questionhasCorrect(question);
      // });
      // console.log(this.canPublish.length)
      // let check = true;
      // for(let i=0;i< this.canPublish.length; i++) {
      //   console.log(this.canPublish[i].hasCorrect)
      // }
      // return;
      this.quizService.publishQuiz(this.quiz_id).subscribe(res => {
        this.quiz = res
      },
      err => {
        console.log(err.error)
        this.errMsg = err.error; 
      })
    }
  }

  Logout() {
    this.userService.deleteToken();
    this.router.navigate(['/user']);
  }

  ngOnInit() {
    this.quiz_id = this.route.snapshot.paramMap.get('quiz_id');
    this.getQuiz();
    this.getQuestions();
  }

}
